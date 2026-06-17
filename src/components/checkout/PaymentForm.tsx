import { useEffect, useState } from 'react'

import type { Plan } from '#/types'
import { Loader2Icon } from 'lucide-react'

import { Link, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import { verifyIntentFn } from '#/server/paymongo'

const EXPIRY_MS = 1 * 60 * 1000
const POLL_INTERVAL_MS = 5000

interface PaymentFormProps {
  intentId: string
  qrCodeImageUrl: string | null
  selectedPlan: Plan
}

export default function PaymentForm({
  intentId,
  qrCodeImageUrl,
  selectedPlan,
}: PaymentFormProps) {
  const navigate = useNavigate()
  const [expired, setExpired] = useState(false)

  const amount = selectedPlan.price

  useEffect(() => {
    if (!intentId || expired) return

    let active = true
    const startedAt = Date.now()

    const id = setInterval(async () => {
      try {
        const { status } = await verifyIntentFn({ data: { intentId } })
        if (!active) return

        if (status === 'succeeded') {
          clearInterval(id)
          navigate({
            to: '/payment/return',
            search: { payment_intent_id: intentId },
          })
        } else if (Date.now() - startedAt > EXPIRY_MS) {
          clearInterval(id)
          setExpired(true)
        }
      } catch (err) {}
    }, POLL_INTERVAL_MS)

    return () => {
      active = false
      clearInterval(id)
    }
  }, [intentId, expired, navigate])

  const showQr = Boolean(qrCodeImageUrl) && !expired

  return (
    <div className="w-full space-y-6 bg-white p-9 md:w-1/2">
      <div className="space-y-1">
        <p className="font-display text-primary-text text-[17px] leading-[1.4] font-bold">
          Pay with QR Ph
        </p>
        <p className="text-muted font-sans text-[13px] leading-[1.4]">
          Charged once. Scan the code with any QR Ph-enabled bank or e-wallet
          app.
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4">
        {showQr ? (
          <>
            <div className="rounded-lg border bg-white p-4">
              <img
                src={qrCodeImageUrl!}
                alt="QR Ph payment code"
                className="size-56"
              />
            </div>

            <div className="text-muted flex flex-row items-center gap-2 font-mono text-[11px] leading-[1.4] tracking-[0.4px] uppercase">
              <Loader2Icon className="size-3.5 animate-spin" />
              Waiting for your ₱{amount}.00 payment…
            </div>

            <p className="text-muted text-center font-sans text-[12px] leading-[1.45]">
              Keep this page open — it updates automatically once your bank
              confirms the payment.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-destructive text-center font-sans text-[13px] leading-[1.45]">
              {expired
                ? 'This code expired before payment was received. Start the upgrade again to get a new code.'
                : 'We could not load a QR code for this payment. Start the upgrade again.'}
            </p>
            <Button
              asChild
              className="h-12 font-mono leading-[1.4] font-semibold tracking-[0.8px] uppercase"
            >
              <Link to="/app/hangar" className="text-white!">
                Back to the Hangar
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
