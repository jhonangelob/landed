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

import { notify } from '#/lib/toast'

import type { PlanId } from '#/validators/subscription'

import { getPlanById } from '#/constants/plan'

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
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })
      notify.success(
        `You are now on ${getPlanById(planId).name}`,
        'Welcome aboard — enjoy your upgraded cabin.',
      )
    },
    onError: (error) => {
      notify.fromError(error, 'Could not update your subscription')
    },
  })
}
