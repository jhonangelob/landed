import { RATE_LIMIT_MAX_GENERATIONS, RATE_LIMIT_WINDOW_MINUTES } from '#/config'
import { clToHtml, cvToHtml } from '#/helper/document'
import {
  buildCoverLetterSystemPrompt,
  buildCvSystemPrompt,
  buildUserPrompt,
  parseAiResponse,
} from '#/helper/prompt'
import type { CoverLetterContent, CvContent } from '#/types'
import { anthropic } from '@ai-sdk/anthropic'
import { renderToBuffer } from '@react-pdf/renderer'
import { generateText } from 'ai'
import { and, count, desc, eq, gte } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { recordAiUsage } from '#/server/aiUsage'
import { ensureSession } from '#/server/session'

import { getUserPlan } from '#/lib/auth/subscription'
import { db } from '#/lib/db/index.server'
import {
  applications,
  generatedDocs,
  pilotProfiles,
  users,
} from '#/lib/db/schema'
import { CoverLetter } from '#/lib/pdf/templates/CoverLetter'
import { AppError } from '#/lib/utils'

import {
  coverLetterAiSchema,
  cvSchema,
  exportCoverLetterSchema,
  exportDocumentSchema,
  generateDocumentSchema,
  getDocumentSchema,
} from '#/validators/documents'

import { TEMPLATE_MAP, isTemplateLocked } from '#/constants/templates'

import { checkGenerationLimit, increaseGenerationUsed } from './subscription'

export const getDocuments = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const cv = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cv'),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))
      .limit(1)

    const cover_letter = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cover_letter'),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))
      .limit(1)

    return {
      cv,
      cover_letter,
    }
  })

export const getDocumentHistory = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const cv = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cv'),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))

    const cover_letter = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cover_letter'),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))

    return {
      cv,
      cover_letter,
    }
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
        ? callModel(buildCvSystemPrompt()).then(async ({ text, usage }) => {
            await recordAiUsage({
              userId: session.user.id,
              model,
              kind: 'cv',
              usage,
            })
            return parseAiResponse(text, cvSchema)
          })
        : Promise.resolve(undefined),
      wantsCoverLetter
        ? callModel(buildCoverLetterSystemPrompt()).then(
            async ({ text, usage }) => {
              await recordAiUsage({
                userId: session.user.id,
                model,
                kind: 'cover_letter',
                usage,
              })
              const ai = parseAiResponse(text, coverLetterAiSchema)
              return {
                sender: {
                  name: user.name,
                  location: profile.location ?? '',
                  phone: profile.phone ?? '',
                  email: user.email,
                },
                date: new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
                recipient: {
                  name: ai.recipient?.name,
                  title: ai.recipient?.title,
                  company: application.company,
                  address: ai.recipient?.address,
                },
                greeting: ai.greeting,
                opening: ai.opening,
                body: ai.body,
                closing: ai.closing,
              } satisfies CoverLetterContent
            },
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

    const Template = TEMPLATE_MAP[data.template]
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

export const exportCoverLetterPdf = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => exportCoverLetterSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const doc = await db
      .select({ contentJson: generatedDocs.contentJson })
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.applicationId),
          eq(generatedDocs.userId, session.user.id),
          eq(generatedDocs.type, 'cover_letter'),
        ),
      )
      .orderBy(desc(generatedDocs.createdAt))
      .limit(1)
      .then((r) => r.at(0))

    if (!doc) throw new AppError('DOCUMENT_NOT_FOUND', 'Document not found')

    const date = new Date()

    const fileName = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('')

    const pdfBuffer = await renderToBuffer(
      CoverLetter({
        content: doc.contentJson as CoverLetterContent,
      }),
    )

    return {
      base64: Buffer.from(pdfBuffer).toString('base64'),
      filename: `${fileName}-Cover-Letter.pdf`,
    }
  })

export async function checkRateLimit() {
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
}
