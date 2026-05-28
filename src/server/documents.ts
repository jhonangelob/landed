import { clToHtml, cvToHtml } from '#/helper/document'
import { anthropic } from '@ai-sdk/anthropic'
import { renderToBuffer } from '@react-pdf/renderer'
import { generateText } from 'ai'
import { and, desc, eq } from 'drizzle-orm'
import z from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/lib/auth/session'
import { getUserPlan } from '#/lib/auth/subscription'
import { db } from '#/lib/db'
import { applications, generatedDocs, pilotProfiles } from '#/lib/db/schema'
import { ClassicTemplate } from '#/lib/pdf/templates/classic'
import { MinimalTemplate } from '#/lib/pdf/templates/minimal'
import { ModernTemplate } from '#/lib/pdf/templates/modern'
import { AppError } from '#/lib/utils'

import {
  aiResponseSchema,
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
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
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
      .orderBy(desc(generatedDocs.version), desc(generatedDocs.createdAt))
      .limit(2)

    return result
  })

export const generateDocuments = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => generateDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const limit = await checkGenerationLimit()
    if (limit.hasReached)
      throw new AppError('GENERATION_LIMIT_REACHED', 'Limit Reached')

    const [profile] = await db
      .select()
      .from(pilotProfiles)
      .where(eq(pilotProfiles.userId, session.user.id))
      .limit(1)

    const [application] = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.id, data.applicationId),
          eq(applications.userId, session.user.id),
        ),
      )

    const [latest] = await db
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

    const nextVersion = latest ? latest.version + 1 : 1

    if (!application) throw new AppError('NOT_FOUND', 'Application not found')
    if (!profile)
      throw new AppError(
        'NOT_FOUND',
        'Profile not found — complete your Pilot Profile first',
      )

    const { text } = await generateText({
      model: anthropic(process.env.ANTHROPIC_HAIKU_MODEL!),
      system: `
        You are Co-Pilot, an expert CV writer inside the Landed app.
        Respond ONLY with valid JSON — no markdown, no backticks, no extra text.
        Return this exact shape:
        {
          "cv": {
            "headline": "string",
            "summary": "string",
            "experience": [{ "company": "string", "role": "string", "dates": "string", "bullets": ["string"] }],
            "skills": ["string"],
            "education": [{ "institution": "string", "degree": "string", "year": "string" }]
          },
          "coverLetter": {
            "opening": "string",
            "body": "string",
            "closing": "string"
          }
        }
        Rules:
        - Mirror language from the job posting
        - Reorder skills to match requirements
        - Use numbers and outcomes wherever the profile has them
        - Do NOT invent experience or skills not in the profile
      `.trim(),

      prompt: `
        Job Details:
        Company: ${application.company}
        Role: ${application.role}

        Job Posting:
        ${application.description}

        Candidate Profile:
        Name: ${profile.headline}
        Summary: ${profile.summary}
        Skills: ${(profile.skills ?? []).join(', ')}
        Experience: ${JSON.stringify(profile.experience, null, 2)}
        Education: ${JSON.stringify(profile.education, null, 2)}
      `.trim(),
      maxOutputTokens: 3000,
    })

    await increaseGenerationUsed()

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

    return {
      id: application.id,
      cv: parsed.cv,
      coverLetter: parsed.coverLetter,
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
        'Upgrade to Runway to unlock this template',
      )
    }

    const [doc] = await db
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
