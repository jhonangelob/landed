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
  updateStatusSchema,
} from '#/validators/application'

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

export const getApplicationDetails = createServerFn({ method: 'GET' })
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
        ),
      )
      .limit(1)

    return result[0] ?? null
  })

export const saveApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => createApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    const [application] = await db
      .insert(applications)
      .values({
        userId: session.user.id,
        company: data.companyName,
        role: data.jobTitle,
        jobPostText: data.jobDescription,
        status: 'spotted',
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
        company: data.companyName,
        role: data.jobTitle,
        status: data.status,
        location: data.location,
        salaryRange: data.salaryRange,
        jobUrl: data.jobUrl,
        notes: data.notes,
      })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
        ),
      )
  })

export const updateApplicationStatus = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateStatusSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await getSession()

    if (!session) throw new Error('Unauthorized')

    await db
      .update(applications)
      .set({ status: data.status })
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
