import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  createSubscription,
  getSubscription,
  updateSubscription,
} from '#/server/subscription'

import type { PlanId } from '#/validators/subscription'

export const subscriptionQueryKey = ['subscription'] as const

export function useSubscriptionQuery() {
  return useSuspenseQuery({
    queryKey: subscriptionQueryKey,
    queryFn: () => getSubscription(),
  })
}

export function useCreateSubscriptionMutation() {
  return useMutation({
    mutationFn: () => createSubscription(),
  })
}

export function useUpdateSubscriptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (planId: PlanId) => updateSubscription({ data: { planId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })
    },
  })
}
