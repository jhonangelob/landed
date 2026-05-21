import { eq } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { pilotProfiles, users } from '#/lib/db/schema'

import { pilotProfileSchema } from '#/validators/profile'

export const getProfile = createServerFn({ method: 'GET' }).handler(
  async (): Promise<any | null> => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    const result = await db
      .select()
      .from(pilotProfiles)
      .where(eq(pilotProfiles.userId, session.user.id))
      .limit(1)

    return result[0] ?? null
  },
)

export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => pilotProfileSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    await db
      .update(users)
      .set({ name: data.fullName, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))

    await db
      .insert(pilotProfiles)
      .values({
        userId: session.user.id,
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        skills: data.skills,
        experience: data.experience as any,
        education: data.education as any,
        links: data.links as any,
        preferences: data.preferences as any,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pilotProfiles.userId,
        set: {
          headline: data.headline,
          summary: data.summary,
          location: data.location,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          links: data.links,
          preferences: data.preferences as any,
          updatedAt: new Date(),
        },
      })

    return { success: true }
  })

export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => pilotProfileSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    await db
      .update(users)
      .set({ name: data.fullName, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))

    await db
      .update(pilotProfiles)
      .set({
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        skills: data.skills,
        experience: data.experience,
        education: data.education,
        links: data.links,
        preferences: data.preferences as any,
        updatedAt: new Date(),
      })
      .where(eq(pilotProfiles.userId, session.user.id))

    return { success: true }
  })
