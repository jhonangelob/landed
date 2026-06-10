import { CheckIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

import { PLANS } from '#/constants/plan'

import { Button } from '../ui/button'

export default function Pricing() {
  return (
    <div id="pricing" className="bg-surface-muted flex flex-col items-center gap-2 px-14 py-29">
      <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3] uppercase">
        Pricing
      </p>
      <p className="font-display text-primary-text text-[44px] leading-[1.08] font-bold tracking-[-1.1px]">
        Pick your <span className="text-primary italic">cabin</span>.
      </p>
      <p className="text-muted text-center font-sans text-[17px] leading-[1.6]">
        Every cabin includes unlimited applications, the Flight Deck and your
        Pilot Profile.
        <br /> You only pay for more Co-Pilot.
      </p>
      <div className="mt-8 mb-4 grid grid-cols-3 gap-4">
        {PLANS.map((item, index) => (
          <div
            className={cn(
              'relative flex w-95 flex-col gap-6 rounded-lg border bg-white px-6.5 py-7',
              index === 1 && 'border-primary',
            )}
            key={index}
          >
            <div
              className={cn(
                'bg-primary -top-3.5 rounded-full px-2.5 py-1 font-mono text-[10px] leading-[1.4] tracking-[1.2px] text-white uppercase',
                index === 1 ? 'absolute' : 'hidden',
              )}
            >
              Most Popular
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.5px] uppercase">
                {item.id}
              </p>
              <p className="text-muted text-[14px] leading-none">
                <span className="text-primary-text font-display text-[44px] leading-[1.08] font-bold tracking-[-1.1px]">
                  ₱{item.price}
                </span>{' '}
                per access month
              </p>
              <p className="text-muted font-sans text-[14px] leading-normal">
                For an active search with a lot of irons in the fire.
              </p>
            </div>

            <div>
              {item.features.map((feature, i) => (
                <div
                  key={i}
                  className={cn(
                    'text-ink-muted flex flex-row items-center gap-2.5 border-b border-dashed py-2 font-sans text-[14px] leading-normal',
                    i + 1 >= item.features.length && 'border-none',
                  )}
                >
                  <CheckIcon className="text-primary size-3 stroke-4" />
                  {feature}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className={cn(
                'text-ink-strong mt-auto bg-white! font-mono text-[12px] leading-[1.4] font-medium tracking-[1px] uppercase',
                index === 1 && 'bg-primary! border-none text-white!',
              )}
            >
              Choose {item.name}
            </Button>
          </div>
        ))}
      </div>
      <p className="text-muted text-center font-mono text-[12px] leading-[1.4] tracking-[0.5px]">
        One-time for each access period — no auto-renewal, no surprise charges.
        Renew whenever you’re ready.
      </p>
    </div>
  )
}
