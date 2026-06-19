import { formatDate } from '#/helper/date'
import type { Plan } from '#/types'
import { ArrowUpIcon, CheckIcon } from 'lucide-react'

import { Kicker } from '#/components/ui/kicker'

const DAY_MS = 24 * 60 * 60 * 1000

interface InformationPanelProps {
  selectedPlan: Plan
}

export default function InformationPanel({
  selectedPlan,
}: InformationPanelProps) {
  const accessStart = new Date()
  const accessEnd = selectedPlan.duration
    ? new Date(Date.now() + selectedPlan.duration * DAY_MS)
    : null

  return (
    <div className="bg-surface-subtle w-full border-b p-9 md:w-1/2 md:border-r md:border-b-0">
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
        You'll pay once for {selectedPlan.duration} days of access. Nothing
        renews automatically.
      </p>

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
        One-time charge for this access period. No auto-renewal; renew manually
        whenever you're ready.
      </div>
    </div>
  )
}
