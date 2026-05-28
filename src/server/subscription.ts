import { and, eq, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

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

    await db.insert(subscriptions).values({
      userId: session.user.id,
    })
  },
)

export const checkGenerationLimit = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await ensureSession()

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1)
      .then((r) => r[0] ?? null)

    const used = sub.generationsUsed
    const limit = sub.generationsLimit

    if (used >= limit)
      throw new AppError('GENERATION_LIMIT_REACHED', 'Limit Reached')

    return {
      used,
      limit,
      remaining: limit - used,
      hasReached: used >= limit,
    }
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
        sql`${subscriptions.generationsUsed} < ${subscriptions.generationsLimit}`,
      ),
    )
    .returning({ generationsUsed: subscriptions.generationsUsed })

  if (updated.length === 0) {
    throw new AppError(
      'GENERATION_LIMIT_REACHED',
      'Generation limit reached — upgrade your plan to continue',
    )
  }

  return { success: true }
})
