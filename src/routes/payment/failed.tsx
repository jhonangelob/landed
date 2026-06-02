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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Payment failed</h1>
      <p className="text-muted-foreground max-w-md">
        {detail ??
          "We couldn't process your payment. No charge was made — please try again."}
      </p>
      <Button asChild>
        <Link to="/checkout">Back to checkout</Link>
      </Button>
    </div>
  )
}
