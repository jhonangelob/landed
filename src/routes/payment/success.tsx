import { useEffect } from 'react'

import { subscriptionQueryKey } from '#/hooks/useSubscriptionQueries'
import { CheckCircleIcon, MoveRightIcon } from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/payment/success')({
  head: () => ({
    meta: [{ title: 'Landed | Payment Successful' }],
  }),
  component: PaymentSuccess,
})

function PaymentSuccess() {
  const queryClient = useQueryClient()

  // The plan was updated server-side during /payment/return — refresh the
  // cached subscription so the rest of the app reflects the new plan.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })
  }, [queryClient])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-120 flex-col gap-5 rounded-lg border bg-white px-10 pt-11 pb-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircleIcon className="size-14 text-success" />
          <p className="font-mono text-[11px] leading-[1.4] tracking-[1.7px] text-success uppercase">
            Payment Confirmed
          </p>
          <p className="font-display text-primary-text text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
            You're flying <span className="text-primary">First Class</span>.
          </p>
          <p className="font-sans text-[14px] leading-[1.55] text-ink-muted">
            Your cabin is live now — unlimited Co-Pilot generations and the rest
            are unlocked through <span className="font-bold">2 Jul 2026</span>.
            A receipt is on its way to your inbox.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-divider bg-surface-muted">
          <div className="flex flex-row justify-between border-b border-dashed px-4.5 py-3.5">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[9px] leading-[1.4] tracking-[1.3px] text-muted uppercase">
                Cabin · active
              </p>
              <p className="font-display text-[17px] leading-[1.4] font-bold text-ink-strong">
                First Class
              </p>
            </div>
            <div className="flex flex-col gap-2 text-end">
              <p className="font-mono text-[9px] leading-[1.4] tracking-[1.3px] text-muted uppercase">
                Confirmation
              </p>
              <p className="text-primary font-mono text-[13px] leading-[1.4] tracking-[0.5px] uppercase">
                LND-FST-2JUN-7Q42
              </p>
            </div>
          </div>
          <div className="px-4.5 pt-1.5 pb-3">
            <div className="flex flex-row items-center justify-between border-b border-dashed py-2">
              <p className="font-sans text-[13px] leading-[1.4] text-muted">
                Amount paid
              </p>
              <p className="font-mono text-[12px] leading-[1.3] text-ink-strong">
                $29.00 · one-time
              </p>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-dashed py-2">
              <p className="font-sans text-[13px] leading-[1.4] text-muted">
                Method
              </p>
              <p className="font-mono text-[12px] leading-[1.3] text-ink-strong">
                VISA ···· 4242
              </p>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-dashed py-2">
              <p className="font-sans text-[13px] leading-[1.4] text-muted">
                Access through
              </p>
              <p className="font-mono text-[12px] leading-[1.3] text-ink-strong">
                2 Jul 2026
              </p>
            </div>
            <div className="flex flex-row items-center justify-between py-2">
              <p className="font-sans text-[13px] leading-[1.4] text-muted">
                Auto-renewal
              </p>
              <p className="font-mono text-[12px] leading-[1.3] text-success">
                Off — renew manually
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="text-white">
            <Link
              to="/flight-deck"
              className="h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] text-white! uppercase"
            >
              Back to the Flight Deck <MoveRightIcon />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] uppercase"
          >
            View Receipt
          </Button>
          <p className="mt-3 text-center font-mono text-[11px] leading-[1.4] tracking-[0.4px] text-muted">
            Questions about this charge?{' '}
            <span className="cursor-pointer text-ink-muted underline">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
