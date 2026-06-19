import { CircleOffIcon, MoveRightIcon, TriangleAlertIcon } from 'lucide-react'

import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/payment/failed')({
  head: () => ({
    meta: [{ title: 'Landed | Activation Issue' }],
  }),
  validateSearch: (search: Record<string, unknown>): { reason?: string } => {
    return typeof search.reason === 'string' ? { reason: search.reason } : {}
  },
  component: PaymentFailed,
})

function PaymentFailed() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-120 flex-col gap-5 rounded-lg border bg-white px-6 pt-11 pb-8 md:px-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <CircleOffIcon className="text-danger-strong size-14" />
          <p className="text-danger-strong font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
            Activation Snag
          </p>
          <p className="font-display text-primary-text text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
            Your cabin didn't{' '}
            <span className="text-primary italic">unlock</span>.
          </p>
          <p className="text-ink-muted font-sans text-[14px] leading-[1.55]">
            Your QR Ph payment may have already gone through, but we couldn't
            activate your plan on our end. You won't be charged twice; reach out
            and we'll get your cabin open.
          </p>
        </div>

        <div className="bg-surface-danger-subtle border-destructive/20 flex flex-row gap-3 rounded-lg border px-4 py-3">
          <TriangleAlertIcon className="text-destructive size-10" />
          <div className="flex flex-col gap-1">
            <p className="text-ink-strong font-sans text-[13px] leading-normal font-bold">
              Your payment went through, activation didn't.
            </p>
            <p className="text-ink-muted font-sans text-[13px] leading-normal font-normal">
              The QR Ph charge cleared, but updating your subscription failed on
              our side.{' '}
              <span className="text-danger-strong">
                code: subscription_update_failed
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              1
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Don't pay again; your QR Ph payment already cleared.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              2
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Have your payment reference from your bank or e-wallet app ready.
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="border-primary text-primary flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[11px] leading-[1.45]">
              3
            </p>
            <p className="text-ink-muted text-[13px] leading-[1.45]">
              Contact support and we'll unlock your cabin, usually within
              minutes.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="text-white">
            <Link
              to="/app/hangar"
              className="h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] text-white! uppercase"
            >
              Back to the Hangar <MoveRightIcon />
            </Link>
          </Button>
          <p className="text-muted mt-3 text-center font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
            Charged but no cabin?{' '}
            <span className="text-ink-muted cursor-pointer underline">
              Contact Support
            </span>{' '}
            and we'll sort it.
          </p>
        </div>
      </div>
    </div>
  )
}
