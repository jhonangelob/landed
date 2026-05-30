import type { Subscription } from '#/lib/db/schema'

export interface UsageInfo {
  planId: Subscription['planId']
  used: number
  limit: number
  remaining: number
  unlimited: boolean
  resetAt: Date | null
}

/**
 * Work out when an economy user's generation allowance resets.
 *
 * Paid plans carry an explicit `expiresAt`; economy plans roll over monthly
 * from the day the subscription started.
 */
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

/** Normalise a raw subscription row into the shape the UI cares about. */
export function getUsageInfo(
  sub: Pick<Subscription, 'planId' | 'generationsUsed' | 'generationsLimit'> & {
    startedAt: Date | string
    expiresAt: Date | string | null
  },
): UsageInfo {
  const unlimited = sub.generationsLimit == null
  const limit = sub.generationsLimit ?? Infinity
  const used = sub.generationsUsed
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

/** Friendly "May 31, 2026" style date for toasts and modals. */
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
