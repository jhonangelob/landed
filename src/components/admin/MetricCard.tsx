import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card'

import { cn } from '#/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  delta: number
  context: string
}

export default function MetricCard({
  label,
  value,
  delta,
  context,
}: MetricCardProps) {
  const up = delta >= 0

  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-muted trackingwidest font-mono text-[10px] uppercase">
            {label}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10.5px] font-medium',
              up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
            )}
          >
            {up ? (
              <ArrowUpRightIcon className="size-3" />
            ) : (
              <ArrowDownRightIcon className="size-3" />
            )}
            {Math.abs(delta)}%
          </span>
        </div>

        <span className="text-primary-text font-display text-[28px] leading-none font-bold tracking-tight">
          {value}
        </span>

        <span className="text-muted font-mono text-[10px]">{context}</span>
      </CardContent>
    </Card>
  )
}
