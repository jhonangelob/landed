import type { ApplicationStage } from '#/types'
import {
  and,
  count,
  eq,
  exists,
  getTableColumns,
  isNull,
  sql,
} from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session.server'

import { getUserPlan } from '#/lib/auth/subscription'
import { db } from '#/lib/db/index.server'
import { applications, generatedDocs } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import {
  deleteApplicationSchema,
  getApplicationSchema,
  newApplicationSchema,
  quickApplicationSchema,
  updateApplicationSchema,
  updateApplicationStageSchema,
} from '#/validators/application'

import { getPlanById } from '#/constants/plan'

const STAGE_TIMESTAMP: Partial<
  Record<
    ApplicationStage,
    | 'spottedAt'
    | 'appliedAt'
    | 'inFlightAt'
    | 'interviewAt'
    | 'offerAt'
    | 'landedAt'
    | 'rejectedAt'
    | 'withdrawnAt'
  >
> = {
  spotted: 'spottedAt',
  applied: 'appliedAt',
  in_flight: 'inFlightAt',
  interview: 'interviewAt',
  offer: 'offerAt',
  landed: 'landedAt',
  rejected: 'rejectedAt',
  withdrawn: 'withdrawnAt',
}

export const getApplications = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    return await db
      .select({
        ...getTableColumns(applications),
        hasDocuments: sql<boolean>`${exists(
          db
            .select({ id: generatedDocs.id })
            .from(generatedDocs)
            .where(eq(generatedDocs.applicationId, applications.id)),
        )}`,
      })
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

export const quickApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => quickApplicationSchema.parse(data))
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
          `You've reached the ${plan.applications}-application limit on your plan. Upgrade to add more.`,
        )
    }

    const [application] = await db
      .insert(applications)
      .values({
        userId: session.user.id,
        company: data.company,
        role: data.role,
        description: '',
        stage: 'spotted',
      })
      .returning()

    return application
  })

export const createApplication = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => newApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const plan = getPlanById(await getUserPlan(session.user.id))

    const now = new Date()
    const stageColumn = STAGE_TIMESTAMP[data.stage]

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
          `You've reached the ${plan.applications}-application limit on your plan. Upgrade to add more.`,
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
        ...(stageColumn && { [stageColumn]: now }),
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

    const now = new Date()
    const stageColumn = STAGE_TIMESTAMP[data.stage]

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
        description: data.description,
        updatedAt: new Date(),
        ...(stageColumn && { [stageColumn]: now }),
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

    const now = new Date()
    const stageColumn = STAGE_TIMESTAMP[data.stage]

    await db
      .update(applications)
      .set({
        stage: data.stage,
        updatedAt: now,
        ...(stageColumn && { [stageColumn]: now }),
      })
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
