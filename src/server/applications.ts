import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { applications } from '#/lib/db/schema'
import {
  deleteApplicationSchema,
  updateApplicationSchema,
} from '#/validators/application'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, isNull } from 'drizzle-orm'

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
