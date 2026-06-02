import { useState } from 'react'

import { CreditCardIcon, MoveRightIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import {
  attachMethodFn,
  createIntentFn,
  createMethodFn,
} from '#/server/paymongo'

import { cn } from '#/lib/utils'

import { cardPaymentSchema } from '#/validators/payment'
import type { Plan } from '#/validators/subscription'

const METHODS = [
  { id: 'card', label: 'Card', icon: <CreditCardIcon /> },
  {
    id: 'qrph',
    label: 'QR PH',
    icon: <img src="/assets/icon_qrph.svg" alt="" className="h-5 w-auto" />,
  },
  {
    id: 'gcash',
    label: 'GCash',
    icon: <img src="/assets/icon_gcash.svg" alt="" className="h-5 w-auto" />,
  },
  {
    id: 'paymaya',
    label: 'Maya',
    icon: (
      <img src="/assets/icon_maya.svg" alt="" className="h-5 w-auto pt-1" />
    ),
  },
  {
    id: 'grab_pay',
    label: 'GrabPay',
    icon: (
      <img src="/assets/icon_grabpay.svg" alt="" className="h-4.5 w-auto" />
    ),
  },
] as const

type Method = (typeof METHODS)[number]['id']

type MethodInput =
  | {
      type: 'card'
      cardNumber: string
      expMonth: number
      expYear: number
      cvc: string
    }
  | { type: Exclude<Method, 'card'> }

interface PaymentFormProps {
  selectedPlan: Plan
}

export default function PaymentForm({ selectedPlan }: PaymentFormProps) {
  const navigate = useNavigate()
  const [method, setMethod] = useState<Method>('card')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amount = selectedPlan.price
  const planId = selectedPlan.id
  const selectedLabel = METHODS.find((m) => m.id === method)!.label

  async function pay(methodInput: MethodInput) {
    setError(null)
    setProcessing(true)
    try {
      const { paymentIntentId, clientKey } = await createIntentFn({
        data: { amount, currency: 'PHP' },
      })

      const { paymentMethodId } = await createMethodFn({ data: methodInput })

      // The return URL carries the intent + plan so the /payment/return
      // loader can verify and apply the subscription.
      const url = new URL('/payment/return', window.location.origin)
      url.searchParams.set('payment_intent_id', paymentIntentId)
      url.searchParams.set('plan_id', planId)

      const { status, nextAction } = await attachMethodFn({
        data: {
          paymentIntentId,
          paymentMethodId,
          clientKey,
          returnUrl: url.toString(),
        },
      })

      if (status === 'succeeded') {
        navigate({
          to: '/payment/return',
          search: { payment_intent_id: paymentIntentId, plan_id: planId },
        })
      } else if (
        status === 'awaiting_next_action' &&
        nextAction?.redirect?.url
      ) {
        // Card 3DS or e-wallet authorization — hand off to the redirect.
        window.location.href = nextAction.redirect.url
      } else {
        setError('Payment could not be processed. Please try again.')
        setProcessing(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setProcessing(false)
    }
  }

  const form = useForm({
    defaultValues: {
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvc: '',
    },
    validators: {
      onSubmit: cardPaymentSchema,
    },
    onSubmit: async ({ value }) => {
      await pay({
        type: 'card',
        cardNumber: value.cardNumber,
        expMonth: Number(value.expMonth),
        expYear: Number(value.expYear),
        cvc: value.cvc,
      })
    },
  })

  return (
    <div className="w-1/2 space-y-6 bg-white p-9">
      <div className="space-y-1">
        <p className="font-display text-primary-text text-[17px] leading-[1.4] font-bold">
          Payment
        </p>
        <p className="font-sans text-[13px] leading-[1.4] text-muted">
          Charged once. Choose how you'd like to pay.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {METHODS.map((m) => (
            <Button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn(
                'flex h-[58.6px] flex-col items-center gap-1 bg-white! p-3 font-mono text-[9px] leading-[1.4] tracking-[0.4px] uppercase',
                m.id === method
                  ? 'text-primary border-primary!'
                  : 'hover:border-primary-text text-muted',
              )}
              variant="outline"
            >
              {m.icon}
              {m.id === 'card' && m.label}
            </Button>
          ))}
        </div>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {error && <p className="text-destructive text-sm">{error}</p>}

        {method === 'card' ? (
          <>
            <form.Field
              name="cardNumber"
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />

            <div className="flex gap-4">
              <form.Field
                name="expMonth"
                children={(field) => (
                  <div className="w-full space-y-1.5">
                    <Label htmlFor="expMonth">Exp month</Label>
                    <Input
                      id="expMonth"
                      inputMode="numeric"
                      placeholder="12"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.map((err, i) => (
                      <p key={i} className="text-destructive text-xs">
                        {err?.message as string}
                      </p>
                    ))}
                  </div>
                )}
              />
              <form.Field
                name="expYear"
                children={(field) => (
                  <div className="w-full space-y-1.5">
                    <Label htmlFor="expYear">Exp year</Label>
                    <Input
                      id="expYear"
                      inputMode="numeric"
                      placeholder="2030"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.map((err, i) => (
                      <p key={i} className="text-destructive text-xs">
                        {err?.message as string}
                      </p>
                    ))}
                  </div>
                )}
              />
              <form.Field
                name="cvc"
                children={(field) => (
                  <div className="w-full space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      inputMode="numeric"
                      placeholder="123"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.map((err, i) => (
                      <p key={i} className="text-destructive text-xs">
                        {err?.message as string}
                      </p>
                    ))}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="mt-12 h-12 font-mono leading-[1.4] font-semibold tracking-[0.8px] uppercase"
            >
              {processing ? (
                'Processing…'
              ) : (
                <>
                  Pay {amount}.00 · Confirm <MoveRightIcon />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">
              You&apos;ll be redirected to {selectedLabel} to authorize the ₱
              {amount}.00 payment.
            </p>
            <Button
              type="button"
              disabled={processing}
              onClick={() => pay({ type: method })}
            >
              {processing ? 'Processing…' : `Continue with ${selectedLabel}`}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
