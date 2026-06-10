import { getUsageInfo } from '#/helper/usage'
import { subscriptionQueryKey } from '#/hooks/useSubscriptionQueries'
import type { Subscription } from '#/types'

import type { QueryClient } from '@tanstack/react-query'

import { FREE_PLAN } from '#/constants/plan'

import type { UsageLimitReason } from './modal'
import { useModalStore } from './modal'

/**
 * Opens the usage-limit modal, hydrating it from whatever subscription data
 * we already have cached so we don't need a round-trip just to render numbers.
 */
export function openUsageLimitModal(
  queryClient: QueryClient,
  reason: UsageLimitReason,
) {
  const sub = queryClient.getQueryData<Subscription | null>(
    subscriptionQueryKey,
  )

  const usage = sub
    ? getUsageInfo(sub)
    : {
        planId: FREE_PLAN.id,
        used: FREE_PLAN.generations ?? 0,
        limit: FREE_PLAN.generations ?? 0,
        resetAt: null,
      }

  useModalStore.getState().open('usageLimit', {
    reason,
    planId: usage.planId,
    used: usage.used,
    limit: usage.limit,
    resetAt: usage.resetAt,
  })
}
