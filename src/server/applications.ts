import { and, count, eq, isNull } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { getUserPlan } from '#/lib/auth/subscription'
import { db } from '#/lib/db/index.server'
import { applications } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import {
  deleteApplicationSchema,
  getApplicationSchema,
  newApplicationSchema,
  updateApplicationSchema,
  updateApplicationStageSchema,
} from '#/validators/application'

import { getPlanById } from '#/constants/plan'

export const getApplications = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

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
  .inputValidator((data: unknown) => getApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    return await db
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
      .then((r) => r.at(0) ?? null)
  })

export const createApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => newApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const plan = getPlanById(await getUserPlan(session.user.id))
    if (plan.applications != null) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(applications)
        .where(
          and(
            eq(applications.userId, session.user.id),
            isNull(applications.deletedAt),
          ),
        )

      if (total >= plan.applications)
        throw new AppError(
          'APPLICATION_LIMIT_REACHED',
          `You've reached the ${plan.applications}-application limit on your plan — upgrade to add more.`,
        )
    }

    const [application] = await db
      .insert(applications)
      .values({
        userId: session.user.id,
        company: data.company,
        role: data.role,
        description: data.description,
        stage: data.stage,
      })
      .returning()

    return application
  })

export const updateApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => updateApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

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
  .inputValidator((data: unknown) => updateApplicationStageSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await db
      .update(applications)
      .set({ stage: data.stage, updatedAt: new Date() })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
          isNull(applications.deletedAt),
        ),
      )
  })

export const deleteApplication = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    await db
      .update(applications)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(applications.userId, session.user.id),
          eq(applications.id, data.id),
          isNull(applications.deletedAt),
        ),
      )
  })
