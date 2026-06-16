import type { CreatePaymentInput, CreateSubscriptionInput } from '#/types'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  createQrPhPayment,
  createSubscription,
  getSubscription,
} from '#/server/subscription'

import { notify } from '#/lib/toast'

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

export function useCreatePaymentMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (value: CreatePaymentInput) =>
      notify.promise(createQrPhPayment({ data: value }), {
        loading: 'Creating Payment...',
        success: 'QR code created',
        error: 'Error creating payment',
      }),
    onSuccess(data) {
      navigate({
        to: '/payment/checkout',
        search: { intentId: data.intentId },
      })
    },
  })
}
