import { RATE_LIMIT_MAX_GENERATIONS, RATE_LIMIT_WINDOW_MINUTES } from '#/config'
import { getUsageInfo } from '#/helper/usage'
import { and, countDistinct, eq, gte, sql } from 'drizzle-orm'

import { ensureSession } from '#/server/session.server'

import { db } from '#/lib/db/index.server'
import { generatedDocs, subscriptions } from '#/lib/db/schema'
import { applyMonthlyReset } from '#/lib/subscription/reset'
import { AppError } from '#/lib/utils'

export async function checkGenerationLimit() {
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

  const usage = getUsageInfo(await applyMonthlyReset(sub))

  if (!usage.unlimited && usage.remaining <= 0)
    throw new AppError(
      'GENERATION_LIMIT_REACHED',
      'You have used all of your generations on the Economy plan',
    )

  return usage
}

export async function increaseGenerationUsed() {
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
}

export async function checkRateLimit() {
  const session = await ensureSession()

  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  )

  const result = await db
    .select({
      total: countDistinct(
        sql`${generatedDocs.applicationId} || '-' || ${generatedDocs.version}`,
      ),
    })
    .from(generatedDocs)
    .where(
      and(
        eq(generatedDocs.userId, session.user.id),
        gte(generatedDocs.createdAt, windowStart),
      ),
    )
    .then((r) => r.at(0) ?? null)

  // Each generation event writes 1–2 rows (CV and/or cover letter) under one
  // (applicationId, version) pair, so count distinct pairs — not raw rows.
  const generations = result?.total ?? 0
  const limit = RATE_LIMIT_MAX_GENERATIONS
  const remaining = Math.max(0, limit - generations)
  const exceeded = generations >= limit

  if (exceeded) {
    throw new AppError(
      'RATE_LIMIT_EXCEEDED',
      `You've generated ${limit} documents in the last ${RATE_LIMIT_WINDOW_MINUTES} minutes. Please wait before generating again.`,
    )
  }

  return { generations, limit, remaining, exceeded }
}
