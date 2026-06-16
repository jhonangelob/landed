import type { Subscription } from '#/types'
import { eq } from 'drizzle-orm'

import { db } from '#/lib/db/index.server'
import { subscriptions } from '#/lib/db/schema'

import { FREE_PLAN } from '#/constants/plan'

/** Returns a new Date `months` after `date` (day-of-month overflow rolls forward). */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/**
 * Normalizes a subscription on read so plan state is always correct wherever
 * it's read — no cron required. Two self-healing steps:
 *
 * 1. Expiry downgrade — a paid plan past its `expiresAt` is dropped to the free
 *    plan in place (fresh monthly allowance). Because this runs inside every
 *    gated read — `checkGenerationLimit` (the generation gate) and
 *    `getSubscription` (the hangar) — an expired user loses unlimited
 *    generations the moment they try to generate, not only when they open the
 *    hangar. `paymentRef` is intentionally left untouched so a replayed payment
 *    stays idempotent (see `applyPlan`).
 * 2. Monthly refill — a free plan whose reset boundary has passed gets its
 *    generation counter zeroed and the boundary rolled forward.
 *
 * Server-only (writes to the DB). Returns the effective subscription.
 */
export async function applyMonthlyReset(
  sub: Subscription,
): Promise<Subscription> {
  const now = new Date()

  // 1. Lapsed paid plan → downgrade to free in place.
  if (sub.expiresAt && new Date(sub.expiresAt) < now) {
    const [downgraded] = await db
      .update(subscriptions)
      .set({
        planId: FREE_PLAN.id,
        generationsUsed: 0,
        generationsLimit: FREE_PLAN.generations,
        generationsResetAt: addMonths(now, 1),
        expiresAt: null,
        isActive: true,
        updatedAt: now,
      })
      .where(eq(subscriptions.id, sub.id))
      .returning()
    return downgraded
  }

  // 2. Unlimited (active paid) plans have no monthly refill.
  if (sub.generationsLimit === null) return sub

  let resetAt = sub.generationsResetAt
    ? new Date(sub.generationsResetAt)
    : addMonths(new Date(sub.startedAt), 1)

  if (now < resetAt) {
    // Not due yet. Backfill the boundary if this is a legacy row so the next
    // read is a cheap no-op.
    if (sub.generationsResetAt) return sub
    const [updated] = await db
      .update(subscriptions)
      .set({ generationsResetAt: resetAt })
      .where(eq(subscriptions.id, sub.id))
      .returning()
    return updated
  }

  // Due: advance the boundary until it lands in the future, then refill.
  while (resetAt <= now) resetAt = addMonths(resetAt, 1)

  const [updated] = await db
    .update(subscriptions)
    .set({
      generationsUsed: 0,
      generationsResetAt: resetAt,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, sub.id))
    .returning()

  return updated
}
