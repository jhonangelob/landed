import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import InformationPanel from '#/components/checkout/InformationPanel'
import PaymentForm from '#/components/checkout/PaymentForm'

import { planIdSchema } from '#/validators/subscription'

import { PLANS } from '#/constants/plan'

export const Route = createFileRoute('/payment/checkout')({
  validateSearch: (search: Record<string, unknown>): { planId?: string } => {
    const parsed = planIdSchema.safeParse(search.planId)
    return parsed.success ? { planId: parsed.data } : {}
  },
  component: CheckoutPage,
})

function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-250 flex-row overflow-hidden rounded-lg border">
        <InformationPanel
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />
        <PaymentForm selectedPlan={selectedPlan} />
      </div>
    </div>
  )
}
