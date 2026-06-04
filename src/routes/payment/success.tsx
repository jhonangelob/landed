import { useEffect } from 'react'

import { subscriptionQueryKey } from '#/hooks/useSubscriptionQueries'
import { CheckCircleIcon, MoveRightIcon } from 'lucide-react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import { getSubscription } from '#/server/subscription'

import { getPlanById } from '#/constants/plan'

export const Route = createFileRoute('/payment/success')({
  head: () => ({
    meta: [{ title: 'Landed | Payment Successful' }],
  }),
  component: PaymentSuccess,
})

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function PaymentSuccess() {
  const queryClient = useQueryClient()

  // The plan was applied server-side during /payment/return — refresh and read
  // the real subscription so the receipt reflects what was actually purchased.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })
  }, [queryClient])

  const { data: subscription } = useQuery({
    queryKey: subscriptionQueryKey,
    queryFn: () => getSubscription(),
    retry: false,
  })

  const plan = subscription ? getPlanById(subscription.planId) : undefined
  const planName = plan?.name ?? 'your plan'
  const amount = plan ? `₱${plan.price}.00` : '—'
  const accessThrough = subscription?.expiresAt
    ? formatDate(subscription.expiresAt)
    : 'No expiry'
  const confirmation = subscription?.paymentRef
    ? subscription.paymentRef.slice(-12).toUpperCase()
    : '—'

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-120 flex-col gap-5 rounded-lg border bg-white px-10 pt-11 pb-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircleIcon className="text-success size-14" />
          <p className="text-success font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
            Payment Confirmed
          </p>
          <p className="font-display text-primary-text text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
            You're now on{' '}
            <span className="text-primary italic">{planName}</span>.
          </p>
          <p className="text-ink-muted font-sans text-[14px] leading-[1.55]">
            Your cabin is live — unlimited Co-Pilot generations and the rest are
            unlocked
            {subscription?.expiresAt ? ` through ${accessThrough}` : ''}. A
            receipt is on its way to your inbox.
          </p>
        </div>

        <div className="border-divider bg-surface-muted rounded-lg border border-dashed">
          <div className="flex flex-row justify-between border-b border-dashed px-4.5 py-3.5">
            <div className="flex flex-col gap-1">
              <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.3px] uppercase">
                Cabin · active
              </p>
              <p className="font-display text-ink-strong text-[17px] leading-[1.4] font-bold">
                {planName}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-end">
              <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.3px] uppercase">
                Confirmation
              </p>
              <p className="text-primary font-mono text-[13px] leading-[1.4] tracking-[0.5px] uppercase">
                {confirmation}
              </p>
            </div>
          </div>
          <div className="px-4.5 pt-1.5 pb-3">
            <div className="flex flex-row items-center justify-between border-b border-dashed py-2">
              <p className="text-muted font-sans text-[13px] leading-[1.4]">
                Amount paid
              </p>
              <p className="text-ink-strong font-mono text-[12px] leading-[1.3]">
                {amount} · one-time
              </p>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-dashed py-2">
              <p className="text-muted font-sans text-[13px] leading-[1.4]">
                Access through
              </p>
              <p className="text-ink-strong font-mono text-[12px] leading-[1.3]">
                {accessThrough}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between py-2">
              <p className="text-muted font-sans text-[13px] leading-[1.4]">
                Auto-renewal
              </p>
              <p className="text-success font-mono text-[12px] leading-[1.3]">
                Off — renew manually
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="text-white">
            <Link
              to="/app"
              className="h-12 font-mono text-[12px] leading-[1.4] font-bold! tracking-[0.7px] text-white! uppercase"
            >
              Back to the Flight Deck <MoveRightIcon />
            </Link>
          </Button>
          <p className="text-muted mt-3 text-center font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
            Questions about this charge?{' '}
            <span className="text-ink-muted cursor-pointer underline">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
