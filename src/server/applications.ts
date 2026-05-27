import { and, eq, isNull } from 'drizzle-orm'
import z from 'zod'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { applications } from '#/lib/db/schema'

import {
  createApplicationSchema,
  deleteApplicationSchema,
  updateApplicationSchema,
  updateStageSchema,
} from '#/validators/application'
import { checkGenerationLimit } from './subscription'

export const getApplications = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    return await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, session.user.id),
          isNull(applications.deletedAt),
        ),
      )
  },
)

export const getApplicationById = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const result = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.id, data.id),
          eq(applications.userId, session.user.id),
          isNull(applications.deletedAt),
        ),
      )

      .limit(1)

    return result[0] ?? null
  })

export const createApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const limit = await checkGenerationLimit()
    if (limit.hasReached) throw new Error('Limit Reached')

    const [application] = await db
      .insert(applications)
      .values({
        userId: session.user.id,
        company: data.company,
        role: data.role,
        description: data.description,
      })
      .returning()

    return application
  })

export const updateApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    await db
      .update(applications)
      .set({
        company: data.company,
        role: data.role,
        stage: data.stage,
        status: data.status,
        location: data.location,
        salaryRange: data.salaryRange,
        url: data.url,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
          isNull(applications.deletedAt),
        ),
      )
  })

export const updateApplicationStage = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateStageSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    await db
      .update(applications)
      .set({ stage: data.stage, updatedAt: new Date() })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
        ),
      )
  })

export const deleteApplication = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    await db
      .update(applications)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
        ),
      )
  })
