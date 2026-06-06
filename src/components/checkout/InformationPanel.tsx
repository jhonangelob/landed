import { formatDate } from '#/helper/date'
import type { Plan } from '#/types'
import { ArrowUpIcon, CheckIcon } from 'lucide-react'

import { Kicker } from '#/components/ui/kicker'

import { cn } from '#/lib/utils'

import { PLANS } from '#/constants/plan'

const DAY_MS = 24 * 60 * 60 * 1000

interface InformationPanelProps {
  selectedPlan: Plan
  onSelectPlan: (plan: Plan) => void
}

export default function InformationPanel({
  selectedPlan,
  onSelectPlan,
}: InformationPanelProps) {
  const paidPlans = [PLANS[1], PLANS[2]]

  const accessStart = new Date()
  const accessEnd = selectedPlan.duration
    ? new Date(Date.now() + selectedPlan.duration * DAY_MS)
    : null

  return (
    <div className="bg-surface-subtle w-1/2 border-r p-9">
      <p className="text-primary flex flex-row items-center pb-3.5 font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.5px] uppercase">
        <ArrowUpIcon className="size-4" /> Cabin Upgrade ·{' '}
        <span className="text-muted font-mono font-normal">Subscription</span>
      </p>
      <p className="font-display text-primary-text pb-1 text-[30px] leading-[1.08] font-bold tracking-[-0.8px]">
        Upgrade to{' '}
        <span className="text-primary capitalize italic">
          {selectedPlan.id}
        </span>
        .
      </p>
      <p className="text-muted font-sans text-[14px] leading-[1.55] font-normal">
        You're on Economy today. Choose a paid cabin below — you will pay once
        for {selectedPlan.duration} days of access. Nothing renews
        automatically.
      </p>

      <div className="mt-5 space-y-1">
        <Kicker className="pb-2 tracking-[1.2px]">Choose your cabin</Kicker>
        {paidPlans.map((item) => (
          <div
            key={item.id}
            className={cn(
              'mb-2 flex cursor-pointer flex-row items-center gap-3 rounded-lg border bg-white px-4 py-3.5',
              selectedPlan.id === item.id && 'border-primary',
            )}
            onClick={() => onSelectPlan(item)}
          >
            <div className="rounded-full border p-1">
              <div
                className={cn(
                  'size-2.5 rounded-full',
                  selectedPlan.id === item.id && 'bg-primary',
                )}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <p className="text-primary-text font-display text-[14px] leading-[1.4] font-bold">
                {item.name}
              </p>
              <p className="text-muted font-sans text-[12px] leading-[1.4] font-normal">
                {item.duration}-day access · renew manually
              </p>
            </div>
            <div className="text-end">
              <p className="font-display text-[20px] leading-[1.4] font-bold tracking-[-0.7px]">
                ₱{item.price}
              </p>
              <p className="text-muted font-mono text-[9px] tracking-[0.5px] uppercase">
                / {item.duration}-day access
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-divider mt-6">
        <Kicker className="pb-2 tracking-[1.2px]">
          {selectedPlan.name} includes
        </Kicker>
        {selectedPlan.features.map((item) => (
          <p
            key={item}
            className="text-primary-text flex flex-row items-center gap-2 pb-1 text-[13px] leading-[1.4]"
          >
            <CheckIcon className="text-primary size-3.5 stroke-4" />
            {item}
          </p>
        ))}
      </div>

      <div className="mt-6 flex flex-row gap-2 border-t pt-4">
        <div className="space-y-1">
          <p className="font-display text-primary-text text-[15px] leading-[1.4] font-bold">
            Total due today
          </p>
          <p className="text-muted font-mono text-[10px] leading-[1.4] font-bold tracking-[0.4px]">
            {selectedPlan.name} · {selectedPlan.duration}-day access
            {accessEnd &&
              ` · ${formatDate(accessStart)} – ${formatDate(accessEnd)}`}
          </p>
        </div>
        <p className="font-display text-primary-text text-[26px] leading-[1.4] font-bold tracking-[-0.7px]">
          ₱{selectedPlan.price}.00
        </p>
      </div>

      <div className="text-muted mt-4 font-mono text-[11px] leading-[1.4] font-normal tracking-[0.4px]">
        One-time charge for this access period. No auto-renewal — renew manually
        whenever you're ready.
      </div>
    </div>
  )
}
