import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { getAiUsageStats, getAdminStats } from '#/server/admin'
import {
  createSubscriptionCodes,
  getSubscriptionCodes,
} from '#/server/codes'

import { parseError } from '#/lib/error'
import { notify } from '#/lib/toast'

import type { AdminStatsPeriod, CreateCodesInput } from '#/validators/admin'

export const adminStatsQueryKey = (period: AdminStatsPeriod) =>
  ['admin-stats', period] as const

export const aiUsageStatsQueryKey = (period: AdminStatsPeriod) =>
  ['admin-ai-usage', period] as const

export const subscriptionCodesQueryKey = ['admin-codes'] as const

export function useAdminStatsQuery(period: AdminStatsPeriod) {
  return useQuery({
    queryKey: adminStatsQueryKey(period),
    queryFn: () => getAdminStats({ data: { period } }),
    placeholderData: keepPreviousData,
  })
}

export function useAiUsageStatsQuery(period: AdminStatsPeriod) {
  return useQuery({
    queryKey: aiUsageStatsQueryKey(period),
    queryFn: () => getAiUsageStats({ data: { period } }),
    placeholderData: keepPreviousData,
  })
}

export function useSubscriptionCodesQuery() {
  return useQuery({
    queryKey: subscriptionCodesQueryKey,
    queryFn: () => getSubscriptionCodes(),
  })
}

export function useCreateCodesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: CreateCodesInput) =>
      notify.promise(createSubscriptionCodes({ data: value }), {
        loading: 'Generating codes…',
        success: (codes) => `Generated ${codes.length} code(s)`,
        error: (err) => parseError(err).message || 'Could not generate codes',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionCodesQueryKey })
    },
  })
}
