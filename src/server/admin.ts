import { and, eq, gte, isNull, ne, sql } from 'drizzle-orm'

import { createServerFn } from '@tanstack/react-start'

import { ensureSession } from '#/server/session'

import { db } from '#/lib/db/index.server'
import {
  aiUsage,
  applications,
  generatedDocs,
  subscriptions,
  users,
} from '#/lib/db/schema'
import { AppError } from '#/lib/utils'

import {
  BUSINESS_PRICE_PHP,
  HAIKU_INPUT_USD_PER_MTOK,
  HAIKU_OUTPUT_USD_PER_MTOK,
  PREMIUM_PRICE_PHP,
} from '#/config'

import { adminStatsSchema } from '#/validators/admin'
import type { AdminStatsPeriod } from '#/validators/admin'

const PERIOD_DAYS: Record<AdminStatsPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

const DAY_MS = 24 * 60 * 60 * 1000

export interface MetricPoint {
  date: string
  value: number
}

export interface Metric {
  total: number
  delta: number
  series: MetricPoint[]
}

export interface AdminStats {
  period: AdminStatsPeriod
  totalUsers: Metric
  activeSubscribers: Metric
  revenue: Metric
  applications: Metric
  aiGenerations: Metric
}

/** A row of `{ day: 'YYYY-MM-DD', value }` produced by a daily GROUP BY. */
type DailyRow = { day: string; value: number }

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

/**
 * Turn daily-grouped rows into a metric: a zero-filled series for the current
 * window plus a window-over-window delta. `total` defaults to the current
 * window sum unless an all-time total is supplied (e.g. total users).
 */
function buildMetric(
  rows: DailyRow[],
  days: number,
  allTimeTotal?: number,
): Metric {
  const byDay = new Map(rows.map((r) => [r.day, Number(r.value)]))
  const today = startOfUtcDay(new Date())

  const series: MetricPoint[] = []
  let currentTotal = 0
  let previousTotal = 0

  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(new Date(today.getTime() - i * DAY_MS))
    const value = byDay.get(key) ?? 0
    currentTotal += value
    series.push({ date: key, value })
  }

  for (let i = days * 2 - 1; i >= days; i--) {
    const key = dayKey(new Date(today.getTime() - i * DAY_MS))
    previousTotal += byDay.get(key) ?? 0
  }

  const delta =
    previousTotal === 0
      ? currentTotal > 0
        ? 100
        : 0
      : ((currentTotal - previousTotal) / previousTotal) * 100

  return {
    total: allTimeTotal ?? currentTotal,
    delta: Math.round(delta * 10) / 10,
    series,
  }
}

export const getAdminStats = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => adminStatsSchema.parse(data))
  .handler(async ({ data }): Promise<AdminStats> => {
    const session = await ensureSession()
    if (session.user.role !== 'admin')
      throw new AppError('UNAUTHORIZED', 'Admin access required')

    const days = PERIOD_DAYS[data.period]
    const today = startOfUtcDay(new Date())
    // Earliest day we need data for: the start of the previous window.
    const windowStart = new Date(today.getTime() - (days * 2 - 1) * DAY_MS)

    const usersDay = sql<string>`(${users.createdAt})::date::text`
    const subsDay = sql<string>`(${subscriptions.startedAt})::date::text`
    const appsDay = sql<string>`(${applications.createdAt})::date::text`
    const docsDay = sql<string>`(${generatedDocs.createdAt})::date::text`

    const [
      userRows,
      subRows,
      revenueRows,
      appRows,
      docRows,
      [{ totalUsers }],
      [{ activeSubscribers }],
    ] = await Promise.all([
      db
        .select({ day: usersDay, value: sql<number>`count(*)`.mapWith(Number) })
        .from(users)
        .where(gte(users.createdAt, windowStart))
        .groupBy(usersDay),

      db
        .select({ day: subsDay, value: sql<number>`count(*)`.mapWith(Number) })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.isActive, true),
            ne(subscriptions.planId, 'economy'),
            gte(subscriptions.startedAt, windowStart),
          ),
        )
        .groupBy(subsDay),

      db
        .select({
          day: subsDay,
          value: sql<number>`coalesce(sum(case ${subscriptions.planId}
            when 'premium' then ${PREMIUM_PRICE_PHP}
            when 'business' then ${BUSINESS_PRICE_PHP}
            else 0 end), 0)`.mapWith(Number),
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.isActive, true),
            gte(subscriptions.startedAt, windowStart),
          ),
        )
        .groupBy(subsDay),

      db
        .select({ day: appsDay, value: sql<number>`count(*)`.mapWith(Number) })
        .from(applications)
        .where(
          and(
            isNull(applications.deletedAt),
            gte(applications.createdAt, windowStart),
          ),
        )
        .groupBy(appsDay),

      db
        .select({ day: docsDay, value: sql<number>`count(*)`.mapWith(Number) })
        .from(generatedDocs)
        .where(gte(generatedDocs.createdAt, windowStart))
        .groupBy(docsDay),

      db
        .select({ totalUsers: sql<number>`count(*)`.mapWith(Number) })
        .from(users),

      db
        .select({ activeSubscribers: sql<number>`count(*)`.mapWith(Number) })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.isActive, true),
            ne(subscriptions.planId, 'economy'),
          ),
        ),
    ])

    return {
      period: data.period,
      totalUsers: buildMetric(userRows, days, totalUsers),
      activeSubscribers: buildMetric(subRows, days, activeSubscribers),
      revenue: buildMetric(revenueRows, days),
      applications: buildMetric(appRows, days),
      aiGenerations: buildMetric(docRows, days),
    }
  })

export interface AiUsageKindStat {
  kind: string
  requests: number
  totalTokens: number
}

export interface AiUsageStats {
  period: AdminStatsPeriod
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCostUsd: number
  byKind: AiUsageKindStat[]
}

export const getAiUsageStats = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => adminStatsSchema.parse(data))
  .handler(async ({ data }): Promise<AiUsageStats> => {
    const session = await ensureSession()
    if (session.user.role !== 'admin')
      throw new AppError('UNAUTHORIZED', 'Admin access required')

    const days = PERIOD_DAYS[data.period]
    const today = startOfUtcDay(new Date())
    const windowStart = new Date(today.getTime() - (days - 1) * DAY_MS)

    const sumExpr = (column: typeof aiUsage.totalTokens) =>
      sql<number>`coalesce(sum(${column}), 0)`.mapWith(Number)

    const [[totals], byKind] = await Promise.all([
      db
        .select({
          requests: sql<number>`count(*)`.mapWith(Number),
          inputTokens: sumExpr(aiUsage.inputTokens),
          outputTokens: sumExpr(aiUsage.outputTokens),
          totalTokens: sumExpr(aiUsage.totalTokens),
        })
        .from(aiUsage)
        .where(gte(aiUsage.createdAt, windowStart)),

      db
        .select({
          kind: aiUsage.kind,
          requests: sql<number>`count(*)`.mapWith(Number),
          totalTokens: sumExpr(aiUsage.totalTokens),
        })
        .from(aiUsage)
        .where(gte(aiUsage.createdAt, windowStart))
        .groupBy(aiUsage.kind),
    ])

    const estimatedCostUsd =
      (totals.inputTokens / 1_000_000) * HAIKU_INPUT_USD_PER_MTOK +
      (totals.outputTokens / 1_000_000) * HAIKU_OUTPUT_USD_PER_MTOK

    return {
      period: data.period,
      requests: totals.requests,
      inputTokens: totals.inputTokens,
      outputTokens: totals.outputTokens,
      totalTokens: totals.totalTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 100) / 100,
      byKind,
    }
  })
