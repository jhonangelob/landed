import { createSubscription } from '#/server/subscription'
import { useMutation } from '@tanstack/react-query'

export function useCreateSubscriptionMutation() {
  return useMutation({
    mutationFn: () => createSubscription(),
  })
}
