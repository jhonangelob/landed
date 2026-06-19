import { PROFILE_LIMITS } from '#/config'
import {
  buildParseFileSystemPrompt,
  buildParseFileUserPrompt,
  parseAiResponse,
} from '#/helper/prompt'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { recordAiUsage } from '#/server/aiUsage'
import { checkParseRateLimit } from '#/server/generation.server'
import { ensureSession } from '#/server/session.server'

import { db } from '#/lib/db/index.server'
import { pilotProfiles } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import { parseFileSchema } from '#/validators/documents'
import { parsedCvSchema, savePilotProfileSchema } from '#/validators/profile'

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
        projects: data.projects,
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
          projects: data.projects,
          certifications: data.certifications,
          phone: data.phone,
          updatedAt: new Date(),
        },
      })

    return { success: true }
  })

export const parseCvFile = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => parseFileSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await checkParseRateLimit()

    if (!process.env.ANTHROPIC_HAIKU_MODEL)
      throw new AppError(
        'MISSING_ENV',
        'ANTHROPIC_HAIKU_MODEL API Key is not defined in the environment variables',
      )

    const model = process.env.ANTHROPIC_HAIKU_MODEL

    let fileContent = data.fileContent
    if (data.fileType === 'docx') {
      const { default: mammoth } = await import('mammoth')
      const { value } = await mammoth.extractRawText({
        buffer: Buffer.from(data.fileContent, 'base64'),
      })
      fileContent = value
    }

    const { text, usage } = await generateText({
      model: anthropic(model),
      messages: buildParseFileUserPrompt(data.fileType, fileContent),
      system: buildParseFileSystemPrompt(),
      maxOutputTokens: 4000,
    })

    await recordAiUsage({
      userId: session.user.id,
      model,
      kind: 'profile_parse',
      usage,
    })

    const parsed = parseAiResponse(text, parsedCvSchema)

    const tryUrl = (u: string): string => {
      if (!u) return ''
      return /^https?:\/\//.test(u) ? u : `https://${u}`
    }

    const stripMailto = (u: string): string => u.replace(/^mailto:/i, '').trim()
    const isEmail = (u: string): boolean =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stripMailto(u))

    // The model sometimes drops the email into the links array — keep real
    // web/profile URLs in links and lift any email-shaped entry into `email`.
    const rawLinks = Array.isArray(parsed.links)
      ? parsed.links.map((l: Record<string, unknown>) => ({
          name: String(l.name ?? ''),
          url: String(l.url ?? ''),
        }))
      : []

    const emailFromLinks = rawLinks.map((l) => stripMailto(l.url)).find(isEmail)

    const email =
      (typeof parsed.email === 'string' && stripMailto(parsed.email)) ||
      emailFromLinks ||
      undefined

    return {
      name: parsed.name || undefined,
      email: email || undefined,
      headline: parsed.headline || undefined,
      summary: parsed.summary || undefined,
      location: parsed.location || undefined,
      phone: parsed.phone?.replace(/\s+/g, '') || undefined,

      skills: Array.isArray(parsed.skills)
        ? parsed.skills
            .filter(
              (s: unknown): s is string =>
                typeof s === 'string' && s.trim().length > 0,
            )
            .slice(0, PROFILE_LIMITS.skills)
        : undefined,

      experience: Array.isArray(parsed.experience)
        ? parsed.experience
            .slice(0, PROFILE_LIMITS.experience)
            .map((e: Record<string, unknown>) => ({
              company: String(e.company ?? ''),
              role: String(e.role ?? ''),
              dates: String(e.dates ?? ''),
              bullets: Array.isArray(e.bullets)
                ? (e.bullets as unknown[])
                    .filter(
                      (b): b is string =>
                        typeof b === 'string' && b.trim().length > 0,
                    )
                    .slice(0, PROFILE_LIMITS.bullets)
                : [''],
            }))
        : undefined,

      education: Array.isArray(parsed.education)
        ? parsed.education
            .slice(0, PROFILE_LIMITS.education)
            .map((e: Record<string, unknown>) => ({
              institution: String(e.institution ?? ''),
              degree: String(e.degree ?? ''),
              year: String(e.year ?? ''),
            }))
        : undefined,

      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
            .slice(0, PROFILE_LIMITS.certifications)
            .map((c: Record<string, unknown>) => ({
              name: String(c.name ?? ''),
              issuer: String(c.issuer ?? ''),
              issueDate: String(c.issueDate ?? ''),
              expiryDate: String(c.expiryDate ?? ''),
              url: tryUrl(c.url as string),
            }))
        : undefined,

      projects: Array.isArray(parsed.projects)
        ? parsed.projects
            .slice(0, PROFILE_LIMITS.projects)
            .map((p: Record<string, unknown>) => ({
              name: String(p.name ?? ''),
              url: tryUrl(p.url as string),
              role: String(p.role ?? ''),
              dates: String(p.dates ?? ''),
              highlights: String(p.highlights ?? ''),
              bullets: Array.isArray(p.bullets)
                ? (p.bullets as unknown[])
                    .filter(
                      (b): b is string =>
                        typeof b === 'string' && b.trim().length > 0,
                    )
                    .slice(0, PROFILE_LIMITS.bullets)
                : [''],
            }))
        : undefined,

      links: rawLinks.length
        ? rawLinks
            .filter((l) => !isEmail(l.url))
            .map((l) => ({ name: l.name, url: tryUrl(l.url) }))
            .slice(0, PROFILE_LIMITS.links)
        : undefined,
    }
  })
