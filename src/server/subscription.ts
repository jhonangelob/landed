import { getUsageInfo } from '#/helper/usage'
import { and, eq, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import { upgradeSchema } from '#/validators/subscription'

import { FREE_PLAN, getPlanById } from '#/constants/plan'

export const getSubscription = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))

    return result[0] ?? null
  },
)

export const createSubscription = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await ensureSession()

    await db
      .insert(subscriptions)
      .values({
        userId: session.user.id,
        planId: FREE_PLAN.id,
        generationsUsed: 0,
        generationsLimit: FREE_PLAN.generations,
      })
      .onConflictDoNothing({ target: subscriptions.userId })
  },
)

export const updateSubscription = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => upgradeSchema.parse(data))
  .handler(async ({ data }) => {
    const session = await ensureSession()
    const plan = getPlanById(data.planId)

    const startedAt = new Date()
    const expiresAt = plan.duration
      ? new Date(startedAt.getTime() + plan.duration * 24 * 60 * 60 * 1000)
      : null

    const generationsLimit = plan.generations ?? 999999

    await db
      .insert(subscriptions)
      .values({
        userId: session.user.id,
        planId: plan.id,
        generationsUsed: 0,
        generationsLimit,
        startedAt,
        expiresAt,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: {
          planId: plan.id,
          generationsUsed: 0,
          generationsLimit,
          startedAt,
          expiresAt,
          isActive: true,
          updatedAt: new Date(),
        },
      })

    return { success: true }
  })

export const checkGenerationLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)
      .then((r) => r[0] ?? null)

    if (!sub)
      throw new AppError(
        'SUBSCRIPTION_NOT_FOUND',
        'No active subscription found — please refresh and try again',
      )

    const usage = getUsageInfo(sub)

    if (!usage.unlimited && usage.remaining <= 0)
      throw new AppError(
        'GENERATION_LIMIT_REACHED',
        'You have used all of your generations on the Economy plan',
      )

    return usage
  },
)

export const increaseGenerationUsed = createServerFn({
  method: 'POST',
}).handler(async () => {
  const session = await ensureSession()

  const updated = await db
    .update(subscriptions)
    .set({
      generationsUsed: sql`${subscriptions.generationsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(subscriptions.userId, session.user.id),
        // Unlimited plans store a NULL limit, so this guard only bites the
        // metered Economy plan.
        sql`(${subscriptions.generationsLimit} IS NULL OR ${subscriptions.generationsUsed} < ${subscriptions.generationsLimit})`,
      ),
    )
    .returning()

  if (updated.length === 0) {
    throw new AppError(
      'GENERATION_LIMIT_REACHED',
      'Generation limit reached — upgrade your plan to continue',
    )
  }

  return getUsageInfo(updated[0])
})
