import { createFileRoute, redirect } from '@tanstack/react-router'

import { fulfillIntentFn } from '#/server/paymongo'

export const Route = createFileRoute('/payment/return')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_intent_id:
      typeof search.payment_intent_id === 'string'
        ? search.payment_intent_id
        : '',
  }),
  loaderDeps: ({ search }) => ({
    intentId: search.payment_intent_id,
  }),
  loader: async ({ deps }) => {
    if (!deps.intentId) throw redirect({ to: '/payment/checkout' })

    // Fulfillment is fully server-authoritative: the plan is derived from the
    // verified intent's metadata and the amount is checked there, so nothing
    // the client passes in the URL can change which plan gets granted.
    try {
      await fulfillIntentFn({ data: { intentId: deps.intentId } })
    } catch {
      throw redirect({
        to: '/payment/failed',
        search: { reason: 'subscription_update_failed' },
      })
    }

    throw redirect({ to: '/payment/success' })
  },
  component: () => <p>Verifying payment…</p>,
})
