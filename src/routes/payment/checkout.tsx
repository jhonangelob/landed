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
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-250 flex-col overflow-hidden rounded-lg border md:flex-row">
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
