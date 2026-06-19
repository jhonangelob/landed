import {
  PARSE_RATE_LIMIT_MAX,
  PARSE_RATE_LIMIT_WINDOW_MINUTES,
  RATE_LIMIT_MAX_GENERATIONS,
  RATE_LIMIT_WINDOW_MINUTES,
} from '#/config'
import { getUsageInfo } from '#/helper/usage'
import { and, count, countDistinct, eq, gte, sql } from 'drizzle-orm'

import { ensureSession } from '#/server/session.server'

import { db } from '#/lib/db/index.server'
import { aiUsage, generatedDocs, subscriptions } from '#/lib/db/schema'
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
      'No active subscription found, please refresh and try again',
    )

  const usage = getUsageInfo(await applyMonthlyReset(sub))

  if (!usage.unlimited && usage.remaining <= 0)
    throw new AppError(
      'GENERATION_LIMIT_REACHED',
      'You have used all of your generations on the Economy plan',
    )

  return usage
}

/**
 * Per-user rate limit for CV parsing. Each parse hits the Anthropic API and is
 * NOT covered by the generation quota, so without this an authenticated user
 * could spam parses for unbounded cost. Counts `profile_parse` usage rows in
 * the rolling window (recorded by `recordAiUsage`).
 */
export async function checkParseRateLimit() {
  const session = await ensureSession()

  const windowStart = new Date(
    Date.now() - PARSE_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  )

  const [row] = await db
    .select({ total: count() })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, session.user.id),
        eq(aiUsage.kind, 'profile_parse'),
        gte(aiUsage.createdAt, windowStart),
      ),
    )

  if (row.total >= PARSE_RATE_LIMIT_MAX) {
    throw new AppError(
      'RATE_LIMIT_EXCEEDED',
      `You've parsed ${PARSE_RATE_LIMIT_MAX} CVs in the last ${PARSE_RATE_LIMIT_WINDOW_MINUTES} minutes. Please wait before trying again.`,
    )
  }
}

/**
 * Returns a generation slot reserved by `increaseGenerationUsed` when the work
 * it was reserved for fails, so a failed generation doesn't permanently consume
 * a credit. Clamped at zero so it can never go negative.
 */
export async function refundGeneration() {
  const session = await ensureSession()

  await db
    .update(subscriptions)
    .set({
      generationsUsed: sql`GREATEST(${subscriptions.generationsUsed} - 1, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, session.user.id))
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
      'Generation limit reached. Upgrade your plan to continue',
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
