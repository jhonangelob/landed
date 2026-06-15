import type { Subscription } from '#/types'

export interface UsageInfo {
  planId: Subscription['planId']
  used: number
  limit: number
  remaining: number
  unlimited: boolean
  resetAt: Date | null
}

export function getUsageResetDate(sub: {
  startedAt: Date | string
  expiresAt: Date | string | null
}): Date | null {
  if (sub.expiresAt) return new Date(sub.expiresAt)

  const reset = new Date(sub.startedAt)
  const now = new Date()
  if (Number.isNaN(reset.getTime())) return null

  while (reset <= now) reset.setMonth(reset.getMonth() + 1)
  return reset
}

export function getUsageInfo(
  sub: Pick<Subscription, 'planId' | 'generationsUsed' | 'generationsLimit'> & {
    startedAt: Date | string
    expiresAt: Date | string | null
  },
): UsageInfo {
  const used = sub.generationsUsed
  const unlimited = sub.generationsLimit === null || sub.generationsLimit === 0
  const limit = sub.generationsLimit ?? 0
  const remaining = unlimited ? Infinity : Math.max(0, limit - used)

  return {
    planId: sub.planId,
    used,
    limit: unlimited ? 0 : limit,
    remaining: unlimited ? 0 : remaining,
    unlimited,
    resetAt: getUsageResetDate(sub),
  }
}

export function formatResetDate(date: Date | string | null): string {
  if (!date) return 'your next billing cycle'
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return 'your next billing cycle'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
