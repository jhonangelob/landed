import { getTimeSince } from '#/helper/date'

import { cn } from '#/lib/utils'

import type { Application } from '#/validators/application'

import { KANBAN_COLUMNS } from '#/constants/stage'
import { formatNumberCompact } from '#/helper/number'

interface ApplicationSummaryProps {
  data: Application
}

export default function ApplicationSummary({ data }: ApplicationSummaryProps) {
  const stagesToLand =
    KANBAN_COLUMNS.length -
    1 -
    KANBAN_COLUMNS.findIndex((item) => item.stage === data.stage)

  const items = [
    {
      label: 'Current Stage',
      value: data.stage,
    },

    {
      label: 'Stages to landed',
      value: stagesToLand,
    },
    {
      label: 'Salary',
      value: data.salaryRange && formatNumberCompact(Number(data.salaryRange)),
    },
    {
      label: 'Applied',
      value: data.appliedAt
        ? new Date(data.appliedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '',
    },
    {
      label: 'Last updated',
      value: getTimeSince(data.updatedAt),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'rounded-md border p-4',
            index === 0 ? 'border-primary/40 bg-primary/10' : 'bg-[#f5f6f8]',
          )}
        >
          <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
            {item.label}
          </p>
          <p
            className={cn(
              'font-display text-[19px] leading-[1.4] font-bold tracking-[-0.5px]',
              index === 0 ? 'text-primary capitalize' : 'text-primary-text',
            )}
          >
            {item.value || '-'}
          </p>
        </div>
      ))}
    </div>
  )
}
