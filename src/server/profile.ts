import { eq } from 'drizzle-orm'
import z from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { pilotProfiles } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import { savePilotProfileSchema } from '#/validators/profile'
import { PROFILE_LIMITS } from '#/validators/shared'

export const getProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(pilotProfiles)
      .where(eq(pilotProfiles.userId, session.user.id))
      .limit(1)
      .then((r) => r.at(0) ?? null)

    if (!result) return null

    return {
      ...result,
      name: result.name ?? '',
      email: result.email,
      headline: result.headline ?? '',
      summary: result.summary ?? '',
      location: result.location ?? '',
      phone: result.phone ?? '',
      timezone: result.timezone ?? '',
      skills: result.skills ?? [],
      experience: result.experience ?? [],
      education: result.education ?? [],
      certifications: result.certifications ?? [],
      projects: result.projects ?? [],
      links: result.links ?? [],
      preferences: result.preferences ?? {
        roles: [],
        preferredVoice: '',
        wordsToAvoid: [],
      },
    }
  },
)

export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => savePilotProfileSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await db
      .insert(pilotProfiles)
      .values({
        name: data.name,
        email: data.email,
        userId: session.user.id,
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        skills: data.skills,
        experience: data.experience,
        education: data.education,
        links: data.links,
        preferences: data.preferences,
        certifications: data.certifications,
        phone: data.phone,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pilotProfiles.userId,
        set: {
          name: data.name,
          headline: data.headline,
          email: data.email,
          summary: data.summary,
          location: data.location,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          links: data.links,
          preferences: data.preferences,
          certifications: data.certifications,
          phone: data.phone,
          updatedAt: new Date(),
        },
      })

    return { success: true }
  })

export const parseCvFile = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        fileContent: z.string(),
        fileType: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_HAIKU_MODEL!,
        max_tokens: 4000,
        system: `You are a CV parser. Extract structured data from the CV provided.
          Return ONLY valid JSON — no explanation, no markdown, no backticks.
          Use this exact structure:
          {
            "headline": "",
            "summary": "",
            "location": "",
            "phone": "",
            "skills": [],
            "experience": [{
              "company": "",
              "role": "",
              "dates": "",
              "location": "",
              "bullets": []
            }],
            "education": [{
              "institution": "",
              "degree": "",
              "year": "",
              "location": "",
              "detail": ""
            }],
            "certifications": [{
              "name": "",
              "issuer": "",
              "issueDate": "",
              "expiryDate": "",
              "url": ""
            }],
            "projects": [{
              "name": "",
              "url": "",
              "role": "",
              "dates": "",
              "highlights": "",
              "bullets": []
            }],
            "links": [{ "name": "", "url": "" }]
          }
          STRICT RULES:
          - Only use data explicitly present in the CV
          - Do NOT invent, infer, or assume anything
          - If a field has no match use empty string "" or empty array []
          - Never return null
          - Never add fields not in the structure above
        `,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: data.fileType,
                  data: data.fileContent,
                },
              },
              {
                type: 'text',
                text: 'Parse this CV and return the structured JSON.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) throw new AppError('AI_PARSE_ERROR', 'Failed to parse CV')

    const result = await response.json()
    const text = result.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed: any = JSON.parse(clean)

    const tryUrl = (u: string): string => {
      if (!u) return ''
      return /^https?:\/\//.test(u) ? u : `https://${u}`
    }

    return {
      headline: parsed.headline || undefined,
      summary: parsed.summary || undefined,
      location: parsed.location || undefined,
      phone: parsed.phone || undefined,
      skills: Array.isArray(parsed.skills)
        ? parsed.skills.filter(Boolean).slice(0, PROFILE_LIMITS.skills)
        : undefined,
      experience: Array.isArray(parsed.experience)
        ? parsed.experience
            .slice(0, PROFILE_LIMITS.experience)
            .map((e: any) => ({
              company: e.company ?? '',
              role: e.role ?? '',
              dates: e.dates ?? '',
              bullets: Array.isArray(e.bullets)
                ? e.bullets.filter(Boolean).slice(0, PROFILE_LIMITS.bullets)
                : [''],
            }))
        : undefined,
      education: Array.isArray(parsed.education)
        ? parsed.education.slice(0, PROFILE_LIMITS.education).map((e: any) => ({
            institution: e.institution ?? '',
            degree: e.degree ?? '',
            year: e.year ?? '',
          }))
        : undefined,
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
            .slice(0, PROFILE_LIMITS.certifications)
            .map((c: any) => ({
              name: c.name ?? '',
              issuer: c.issuer ?? '',
              issueDate: c.issueDate ?? '',
              expiryDate: c.expiryDate ?? '',
              url: tryUrl(c.url ?? ''),
            }))
        : undefined,
      links: Array.isArray(parsed.links)
        ? parsed.links
            .map((l: any) => ({ name: l.name ?? '', url: tryUrl(l.url ?? '') }))
            .slice(0, PROFILE_LIMITS.links)
        : undefined,
    }
  })
