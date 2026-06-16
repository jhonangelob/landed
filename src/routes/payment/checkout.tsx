import { createFileRoute, redirect } from '@tanstack/react-router'

import InformationPanel from '#/components/checkout/InformationPanel'
import PaymentForm from '#/components/checkout/PaymentForm'

import { getQrPaymentFn } from '#/server/paymongo'

import { getPlanById } from '#/constants/plan'

export const Route = createFileRoute('/payment/checkout')({
  validateSearch: (search: Record<string, unknown>): { intentId?: string } =>
    typeof search.intentId === 'string' ? { intentId: search.intentId } : {},
  loaderDeps: ({ search }) => ({ intentId: search.intentId }),
  loader: async ({ deps }) => {
    if (!deps.intentId) throw redirect({ to: '/app/hangar' })

    const payment = await getQrPaymentFn({ data: { intentId: deps.intentId } })

    // Already paid (e.g. the page was reloaded after scanning) — skip straight
    // to the server-authoritative fulfillment route.
    if (payment.status === 'succeeded')
      throw redirect({
        to: '/payment/return',
        search: { payment_intent_id: deps.intentId },
      })

    return { intentId: deps.intentId, ...payment }
  },
  component: CheckoutPage,
})

function CheckoutPage() {
  const { intentId, qrCodeImageUrl, planId } = Route.useLoaderData()
  const selectedPlan = getPlanById(planId)

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <div className="flex w-250 flex-row overflow-hidden rounded-lg border">
        <InformationPanel selectedPlan={selectedPlan} />
        <PaymentForm
          intentId={intentId}
          qrCodeImageUrl={qrCodeImageUrl}
          selectedPlan={selectedPlan}
        />
      </div>
    </div>
  )
}
