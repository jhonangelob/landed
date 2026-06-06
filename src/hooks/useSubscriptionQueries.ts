import type { CreateSubscriptionInput } from '#/types'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { createSubscription, getSubscription } from '#/server/subscription'

export const subscriptionQueryKey = ['subscription'] as const

export function useSubscriptionQuery() {
  return useSuspenseQuery({
    queryKey: subscriptionQueryKey,
    queryFn: () => getSubscription(),
  })
}

export function useCreateSubscriptionMutation() {
  return useMutation({
    mutationFn: (value: CreateSubscriptionInput) =>
      createSubscription({ data: value }),
  })
}
