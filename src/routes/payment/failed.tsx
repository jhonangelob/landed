import { CircleOffIcon, MoveRightIcon, TriangleAlertIcon } from 'lucide-react'

import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

const REASONS: Record<string, string> = {
  '3ds_failed': 'Card authentication was declined.',
  ewallet_cancelled: 'The e-wallet payment was cancelled.',
  subscription_update_failed:
    'Your payment went through but we could not update your plan. Please contact support.',
}

export const Route = createFileRoute('/payment/failed')({
  head: () => ({
    meta: [{ title: 'Landed | Payment Failed' }],
  }),
  validateSearch: (search: Record<string, unknown>): { reason?: string } => {
    return typeof search.reason === 'string' ? { reason: search.reason } : {}
  },
  component: PaymentFailed,
})

function PaymentFailed() {
  const { reason } = Route.useSearch()
  const detail = reason ? REASONS[reason] : undefined

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-120 flex-col gap-5 rounded-lg border bg-white px-10 pt-11 pb-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CircleOffIcon className="text-danger-strong size-14" />
          <p className="text-danger-strong font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
            Payment Declined
          </p>
          <p className="font-display text-primary-text text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
            The didn't <span className="text-primary italic">clear</span>.
          </p>
          <p className="text-ink-muted font-sans text-[14px] leading-[1.55]">
            We couldn't charge your card for the{' '}
            <span className="font-bold">First Class</span> cabin, so nothing was
            billed and your plan is unchanged. Let's try again.
          </p>
        </div>

        <div className="bg-surface-danger-subtle border-destructive/20 flex flex-row gap-3 rounded-lg border px-4 py-3">
          <TriangleAlertIcon className="text-destructive size-10" />
          <div className="flex flex-col gap-1">
            <p className="text-ink-strong font-sans text-[13px] leading-normal font-bold">
              Your bank declined the charge.
            </p>
            <p className="text-ink-muted font-sans text-[13px] leading-normal font-normal">
              The card issuer didn't approve this payment. No funds were taken.{' '}
              <span className="text-danger-strong">code: card_declined</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              1
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Double-check the card number, expiry and CVC.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              2
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Confirm the card allows online payments, or try another card.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              3
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Still stuck? Your bank can clear the block in a moment.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="text-white">
            <Link
              to="/app/hangar"
              className="h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] text-white! uppercase"
            >
              Try again <MoveRightIcon />
            </Link>
          </Button>

          <Button asChild variant="outline" className="! shadow-none!">
            <Link
              to="/app/hangar"
              className="text-primary-text! h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] uppercase"
            >
              Use a different card
            </Link>
          </Button>
          <p className="text-muted mt-3 text-center font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
            Charged but no cabin?{' '}
            <span className="text-ink-muted cursor-pointer underline">
              Contact Support
            </span>{' '}
            — we'll sort it.
          </p>
        </div>
      </div>
    </div>
  )
}
