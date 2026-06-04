import { clToHtml, cvToHtml } from '#/helper/document'
import { buildSystemPrompt, buildUserPrompt } from '#/helper/prompt'
import { anthropic } from '@ai-sdk/anthropic'
import { renderToBuffer } from '@react-pdf/renderer'
import { generateText } from 'ai'
import { and, count, desc, eq, gte } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { getUserPlan } from '#/lib/auth/subscription'
import { db } from '#/lib/db/index.server'
import {
  applications,
  generatedDocs,
  pilotProfiles,
  users,
} from '#/lib/db/schema'
import { ClassicTemplate } from '#/lib/pdf/templates/classic'
import { MinimalTemplate } from '#/lib/pdf/templates/minimal'
import { ModernTemplate } from '#/lib/pdf/templates/modern'
import { AppError } from '#/lib/utils'

import {
  aiResponseSchema,
  documentsByApplicationSchema,
  exportDocumentSchema,
  generateDocumentSchema,
} from '#/validators/documents'
import type { CvContent } from '#/validators/documents'

import { isTemplateLocked } from '#/constants/templates'

import { checkGenerationLimit, increaseGenerationUsed } from './subscription'

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
} as const

export const getDocuments = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => documentsByApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))
      .limit(2)

    return result
  })

export const generateDocuments = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => generateDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await checkGenerationLimit()
    await checkRateLimit()

    const profile = await db
      .select()
      .from(pilotProfiles)
      .where(eq(pilotProfiles.userId, session.user.id))
      .limit(1)
      .then((r) => r.at(0))

    if (!profile)
      throw new AppError(
        'NOT_FOUND',
        'Profile not found — complete your Pilot Profile first',
      )

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .then((r) => r.at(0))

    if (!user) throw new AppError('NOT_FOUND', 'User not found')

    const application = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.id, data.applicationId),
          eq(applications.userId, session.user.id),
        ),
      )
      .then((r) => r.at(0))

    if (!application) throw new AppError('NOT_FOUND', 'Application not found')

    const latest = await db
      .select({ version: generatedDocs.version })
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.applicationId),
          eq(generatedDocs.userId, session.user.id),
        ),
      )
      .orderBy(desc(generatedDocs.version))
      .limit(1)
      .then((r) => r.at(0))

    const nextVersion = (latest?.version ?? 0) + 1

    const { text } = await generateText({
      model: anthropic(process.env.ANTHROPIC_HAIKU_MODEL!),
      system: buildSystemPrompt(),
      prompt: buildUserPrompt({
        company: application.company,
        role: application.role,
        description: application.description || '',
        profile: {
          fullName: user.name,
          email: user.email,
          phone: profile.phone ?? '',
          location: profile.location ?? '',
          headline: profile.headline ?? '',
          summary: profile.summary ?? '',
          skills: profile.skills ?? [],
          experience: profile.experience ?? [],
          certifications: profile.certifications ?? [],
          education: profile.education ?? [],
          links: profile.links ?? { github: '', linkedin: '', portfolio: '' },
          preferences: profile.preferences ?? { roles: [], salaryRange: '' },
        },
      }),
      maxOutputTokens: 4000,
    })

    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    let raw: unknown
    try {
      raw = JSON.parse(cleaned)
    } catch {
      throw new AppError(
        'AI_PARSE_ERROR',
        'AI returned malformed JSON — please try again',
      )
    }

    const result = aiResponseSchema.safeParse(raw)

    if (!result.success) {
      console.error('AI response validation failed:', result.error.issues)
      throw new AppError(
        'AI_VALIDATION_ERROR',
        'AI response has unexpected structure — please try again',
      )
    }

    const parsed = result.data

    // Persist the documents first, then charge the generation — so a failed
    // insert never consumes a user's quota.
    await db.insert(generatedDocs).values([
      {
        userId: session.user.id,
        applicationId: application.id,
        type: 'cv',
        contentJson: parsed.cv,
        contentHtml: cvToHtml(parsed.cv),
        version: nextVersion,
      },
      {
        userId: session.user.id,
        applicationId: application.id,
        type: 'cover_letter',
        contentJson: parsed.coverLetter,
        contentHtml: clToHtml(parsed.coverLetter),
        version: nextVersion,
      },
    ])

    const usage = await increaseGenerationUsed()

    return {
      id: application.id,
      cv: parsed.cv,
      coverLetter: parsed.coverLetter,
      usage,
    }
  })

export const exportCvPdf = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => exportDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const planId = await getUserPlan(session.user.id)

    if (isTemplateLocked(data.template, planId)) {
      throw new AppError(
        'SUBSCRIPTION_NOT_FOUND',
        'Upgrade to Premium to unlock this template',
      )
    }

    const doc = await db
      .select({ contentJson: generatedDocs.contentJson })
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.applicationId),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cv'),
        ),
      )
      .limit(1)
      .then((r) => r.at(0))

    if (!doc) throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found')

    const Template = TEMPLATES[data.template]
    const pdfBuffer = await renderToBuffer(
      Template({
        content: doc.contentJson as CvContent,
        email: session.user.email,
      }),
    )

    return {
      base64: Buffer.from(pdfBuffer).toString('base64'),
      filename: `cv-${data.template}.pdf`,
    }
  })

export const checkRateLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const windowStart = new Date(Date.now() - 30 * 60 * 1000)

    const result = await db
      .select({ total: count() })
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.userId, session.user.id),
          gte(generatedDocs.createdAt, windowStart),
        ),
      )

    const generations = Math.floor((result[0]?.total ?? 0) / 2)
    const limit = 10
    const remaining = Math.max(0, limit - generations)
    const exceeded = generations >= limit

    if (exceeded) {
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        `You've generated ${limit} documents in the last 30 minutes. Please wait before generating again.`,
      )
    }

    return { generations, limit, remaining, exceeded }
  },
)
