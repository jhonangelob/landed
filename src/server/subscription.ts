import { eq, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { getSession } from '#/lib/auth/session'
import { db } from '#/lib/db'
import { subscriptions } from '#/lib/db/schema'

export const createSubscription = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    await db.insert(subscriptions).values({
      userId: session.user.id,
    })
  },
)

// HELPERS

export const checkGenerationLimit = async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const sub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null)

  if (!sub) throw new Error('No subscription found')

  const used = sub.generationsUsed
  const limit = sub.generationsLimit

  return {
    used,
    limit,
    remaining: limit - used,
    hasReached: used >= limit,
  }
}

export const increaseGenerationUsed = async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1)

  const sub = result[0] as (typeof result)[0] | undefined
  if (!sub) throw new Error('Subscription not found')

  if (sub.generationsUsed >= sub.generationsLimit) {
    throw new Error('Generation limit reached — upgrade your plan to continue')
  }

  await db
    .update(subscriptions)
    .set({
      generationsUsed: sql`${subscriptions.generationsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, session.user.id))

  return { success: true }
}
