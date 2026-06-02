import { createFileRoute, redirect } from '@tanstack/react-router'

import { verifyIntentFn } from '#/server/paymongo'
import { updateSubscription } from '#/server/subscription'

import { planIdSchema } from '#/validators/subscription'
import type { PlanId } from '#/validators/subscription'

export const Route = createFileRoute('/payment/return')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_intent_id:
      typeof search.payment_intent_id === 'string'
        ? search.payment_intent_id
        : '',
    plan_id: planIdSchema.safeParse(search.plan_id).success
      ? (search.plan_id as PlanId)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({
    intentId: search.payment_intent_id,
    planId: search.plan_id,
  }),
  loader: async ({ deps }) => {
    if (!deps.intentId) throw redirect({ to: '/checkout' })

    const { status } = await verifyIntentFn({
      data: { intentId: deps.intentId },
    })

    if (status !== 'succeeded') throw redirect({ to: '/payment/failed' })

    // Payment cleared — apply the purchased plan to the subscription.
    if (deps.planId) {
      try {
        await updateSubscription({ data: { planId: deps.planId } })
      } catch {
        throw redirect({
          to: '/payment/failed',
          search: { reason: 'subscription_update_failed' },
        })
      }
    }

    throw redirect({ to: '/payment/success' })
  },
  component: () => <p>Verifying payment…</p>,
})
