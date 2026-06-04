import { eq } from 'drizzle-orm'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'

import type { Plan } from '#/validators/subscription'

/**
 * Applies a paid plan to a user's subscription. This is server-only and is NOT
 * a server function — it can only be reached through verified payment
 * fulfillment (`fulfillIntentFn`) or the webhook, never called directly by a
 * client. Keeping it out of `server/subscription.ts` avoids pulling the
 * server-only db import into the client bundle.
 *
 * Idempotent: re-running with a `paymentRef` that was already applied is a
 * no-op, which stops a succeeded payment from being replayed to keep resetting
 * the generation counter.
 */
export async function applyPlan(
  userId: string,
  plan: Plan,
  paymentRef: string,
) {
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
    .then((r) => r.at(0) ?? null)

  if (existing?.paymentRef && existing.paymentRef === paymentRef) return

  const startedAt = new Date()
  const expiresAt = plan.duration
    ? new Date(startedAt.getTime() + plan.duration * 24 * 60 * 60 * 1000)
    : null

  const generationsLimit = plan.generations ?? null

  await db
    .insert(subscriptions)
    .values({
      userId,
      planId: plan.id,
      generationsUsed: 0,
      generationsLimit,
      startedAt,
      expiresAt,
      isActive: true,
      paymentRef,
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
        paymentRef,
        updatedAt: new Date(),
      },
    })
}
