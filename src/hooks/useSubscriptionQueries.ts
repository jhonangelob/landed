import { createSubscription, getSubscription } from '#/server/subscription'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

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
