import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { pilotProfiles } from '#/lib/db/schema'

import { savePilotProfileSchema } from '#/validators/profile'

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
