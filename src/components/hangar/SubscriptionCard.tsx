import type { Plan } from '#/types'
import { CheckIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

interface SubscriptionCardProps {
  data: Plan
  current: boolean
  onSelect: () => void
}

export default function SubscriptionCard({
  data,
  current,
  onSelect,
}: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        'hover:border-muted-foreground/40 bg-surface-muted flex w-full cursor-pointer flex-col gap-2 rounded-lg border p-4 shadow-none',
        current && 'border-primary bg-primary/10 hover:none',
      )}
      onClick={onSelect}
    >
      <div className="text-muted flex flex-row items-center justify-between font-mono text-[11px] leading-[1.4] font-normal tracking-[1.5px] uppercase">
        {data.name}
        {current && (
          <p className="bg-primary rounded-full px-1.75 py-0.5 font-sans text-[10px] leading-[1.4] font-normal tracking-[1.2px] text-white uppercase">
            Current
          </p>
        )}
      </div>
      <p className="text-primary-text font-display text-[28px] font-bold">
        ₱{data.price}
        {data.price > 0 && (
          <span className="text-muted text-[13px] font-normal">
            {data.duration === 30 ? 'per month' : 'one-time'}
          </span>
        )}
      </p>
      <div className="flex flex-col gap-2">
        {data.features.map((item, index) => (
          <p
            key={index}
            className={cn(
              'text-ink-muted flex flex-row items-center gap-2 border-dashed pb-1 font-sans text-[13px] leading-[1.4] font-normal',
              data.features.length > index + 1 && 'border-b',
            )}
          >
            <CheckIcon className="text-primary size-3 stroke-4" />
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}
