import { RATE_LIMIT_MAX_GENERATIONS, RATE_LIMIT_WINDOW_MINUTES } from '#/config'
import { clToHtml, cvToHtml } from '#/helper/document'
import {
  buildCoverLetterSystemPrompt,
  buildCvSystemPrompt,
  buildUserPrompt,
} from '#/helper/prompt'
import type { CvContent } from '#/types'
import { anthropic } from '@ai-sdk/anthropic'
import { renderToBuffer } from '@react-pdf/renderer'
import { generateText } from 'ai'
import { and, count, desc, eq, gte } from 'drizzle-orm'
import type { ZodType } from 'zod'

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
import { TemplateA } from '#/lib/pdf/templates/TemplateA'
import { TemplateB } from '#/lib/pdf/templates/TemplateB'
import { TemplateC } from '#/lib/pdf/templates/TemplateC'
import { AppError } from '#/lib/utils'

import {
  coverLetterSchema,
  cvSchema,
  exportDocumentSchema,
  generateDocumentSchema,
  getDocumentSchema,
} from '#/validators/documents'

import { isTemplateLocked } from '#/constants/templates'

import { checkGenerationLimit, increaseGenerationUsed } from './subscription'

const TEMPLATES = {
  classic: TemplateA,
  modern: TemplateC,
  minimal: TemplateB,
} as const

function parseAiResponse<T>(text: string, schema: ZodType<T>): T {
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

  const result = schema.safeParse(raw)
  if (!result.success) {
    console.error('AI response validation failed:', result.error.issues)
    throw new AppError(
      'AI_VALIDATION_ERROR',
      'AI response has unexpected structure — please try again',
    )
  }

  return result.data
}

export const getDocuments = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getDocumentSchema.parse(data))
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

    if (!process.env.ANTHROPIC_HAIKU_MODEL)
      throw new AppError(
        'MISSING_ENV',
        'API Key is not defined in the environment variables',
      )

    const model = process.env.ANTHROPIC_HAIKU_MODEL

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

    const links = profile.links?.map((link) => ({
      ...link,
      url: link.url.replace(/^https?:\/\/(www\.)?/, ''),
    }))

    const userPrompt = buildUserPrompt({
      company: application.company,
      role: application.role,
      description: application.description || '',
      profile: {
        id: profile.id,
        updatedAt: profile.updatedAt,
        userId: profile.userId,
        timezone: profile.timezone ?? null,
        projects: profile.projects ?? [],
        name: user.name,
        email: user.email,
        phone: profile.phone ?? '',
        location: profile.location ?? '',
        headline: profile.headline ?? '',
        summary: profile.summary ?? '',
        skills: profile.skills ?? [],
        experience: profile.experience ?? [],
        certifications: profile.certifications ?? [],
        education: profile.education ?? [],
        links: links ?? [],
        preferences: profile.preferences ?? {
          roles: [''],
          preferredVoice: '',
          wordsToAvoid: [''],
        },
      },
    })

    const callModel = (system: string) =>
      generateText({
        model: anthropic(model),
        system,
        prompt: userPrompt,
        maxOutputTokens: 4000,
      })

    const wantsCv = data.type !== 'cover_letter'
    const wantsCoverLetter = data.type !== 'cv'

    const [cv, coverLetter] = await Promise.all([
      wantsCv
        ? callModel(buildCvSystemPrompt()).then(({ text }) =>
            parseAiResponse(text, cvSchema),
          )
        : Promise.resolve(undefined),
      wantsCoverLetter
        ? callModel(buildCoverLetterSystemPrompt()).then(({ text }) =>
            parseAiResponse(text, coverLetterSchema),
          )
        : Promise.resolve(undefined),
    ])

    const docs: (typeof generatedDocs.$inferInsert)[] = []
    if (cv) {
      docs.push({
        userId: session.user.id,
        applicationId: application.id,
        type: 'cv',
        contentJson: cv,
        contentHtml: cvToHtml(cv),
        version: nextVersion,
      })
    }
    if (coverLetter) {
      docs.push({
        userId: session.user.id,
        applicationId: application.id,
        type: 'cover_letter',
        contentJson: coverLetter,
        contentHtml: clToHtml(coverLetter),
        version: nextVersion,
      })
    }

    await db.insert(generatedDocs).values(docs)

    const usage = await increaseGenerationUsed()

    return {
      id: application.id,
      cv,
      coverLetter,
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
      .orderBy(desc(generatedDocs.createdAt))
      .limit(1)
      .then((r) => r.at(0))

    const date = new Date()

    const fileName = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('')

    if (!doc) throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found')

    const Template = TEMPLATES[data.template]
    const pdfBuffer = await renderToBuffer(
      Template({
        content: doc.contentJson as CvContent,
      }),
    )

    return {
      base64: Buffer.from(pdfBuffer).toString('base64'),
      filename: `${fileName}-CV.pdf`,
    }
  })

export const checkRateLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
    )

    const result = await db
      .select({ total: count() })
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.userId, session.user.id),
          gte(generatedDocs.createdAt, windowStart),
        ),
      )
      .then((r) => r.at(0) ?? null)

    const generations = Math.floor((result?.total ?? 0) / 2)
    const limit = RATE_LIMIT_MAX_GENERATIONS
    const remaining = Math.max(0, limit - generations)
    const exceeded = generations >= limit

    if (exceeded) {
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        `You've generated ${limit} documents in the last ${RATE_LIMIT_WINDOW_MINUTES} minutes. Please wait before generating again.`,
      )
    }

    return { generations, limit, remaining, exceeded }
  },
)
