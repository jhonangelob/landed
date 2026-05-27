import { clToHtml, cvToHtml } from '#/helper/document'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { applications, generatedDocs, pilotProfiles } from '#/lib/db/schema'

import { generateDocumentSchema } from '#/validators/co-pilot'

export const getDocuments = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }): Promise<any | null> => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    const result = await db
      .select()
      .from(generatedDocs)
      .where(
        and(
          eq(generatedDocs.applicationId, data.id),
          eq(generatedDocs.userId, session.user.id),
        ),
      )
      .orderBy(generatedDocs.createdAt)
      .limit(2)

    return result
  })

export const generateDocuments = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => generateDocumentSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

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

    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    await db.insert(generatedDocs).values([
      {
        userId: session.user.id,
        applicationId: application.id,
        type: 'cv',
        contentJson: parsed.cv,
        contentHtml: cvToHtml(parsed.cv),
        version: 1,
      },
      {
        userId: session.user.id,
        applicationId: application.id,
        type: 'cover_letter',
        contentJson: parsed.coverLetter,
        contentHtml: clToHtml(parsed.coverLetter),
        version: 1,
      },
    ])

    return {
      id: application.id,
      cv: parsed.cv,
      coverLetter: parsed.coverLetter,
    }
  })
