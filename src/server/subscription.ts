import { getUsageInfo } from '#/helper/usage'
import { and, eq, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import { createSubscriptionSchema } from '#/validators/subscription'

import { FREE_PLAN } from '#/constants/plan'

export const getSubscription = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .then((r) => r.at(0) ?? null)

    if (!result) throw new AppError('NOT_FOUND', 'Subscription not found')

    return result
  },
)

export const createSubscription = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createSubscriptionSchema.parse(data))
  .handler(async ({ data }) => {
    await db
      .insert(subscriptions)
      .values({
        userId: data.userId,
        planId: FREE_PLAN.id,
        generationsUsed: 0,
        generationsLimit: FREE_PLAN.generations,
      })
      .onConflictDoNothing({ target: subscriptions.userId })
  })

export const checkGenerationLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)
      .then((r) => r.at(0) ?? null)

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
