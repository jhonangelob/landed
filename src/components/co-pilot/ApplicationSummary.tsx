import { formatDate, getTimeSince } from '#/helper/date'
import { formatNumberCompact } from '#/helper/number'
import type { Application } from '#/types'

import { cn } from '#/lib/utils'

import { KANBAN_COLUMNS } from '#/constants/stage'

interface ApplicationSummaryProps {
  data: Application
}

export default function ApplicationSummary({ data }: ApplicationSummaryProps) {
  const stagesToLand =
    KANBAN_COLUMNS.length -
    1 -
    KANBAN_COLUMNS.findIndex((item) => item.stage === data.stage)

  const stageTimeline = [
    { label: 'Spotted', date: data.spottedAt },
    { label: 'Applied', date: data.appliedAt },
    { label: 'In Flight', date: data.inFlightAt },
    { label: 'Interview', date: data.interviewAt },
    { label: 'Offer', date: data.offerAt },
    { label: 'Landed', date: data.landedAt },
    { label: 'Rejected', date: data.rejectedAt },
    { label: 'Withdrawn', date: data.withdrawnAt },
  ]
    .filter((stage) => stage.date)
    .map((stage) => ({ label: stage.label, value: formatDate(stage.date) }))

  const items = [
    {
      label: 'Current Stage',
      value: data.stage,
    },

    {
      label: 'Stages before landing',
      value: stagesToLand,
    },
    {
      label: 'Salary',
      value: data.salaryRange && formatNumberCompact(Number(data.salaryRange)),
    },
    ...stageTimeline,
    {
      label: 'Last updated',
      value: getTimeSince(data.updatedAt),
    },
  ]

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="-mb-px grid grid-cols-1 md:-mr-px md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex flex-row justify-between border-b bg-white p-4 md:flex-col md:border-r',
              index === 0 && 'md:bg-primary/10',
            )}
          >
            <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
              {item.label}
            </p>
            <p
              className={cn(
                'md:font-display font-sans text-[14px] leading-[1.4] font-medium tracking-[-0.5px] md:text-[19px] md:font-bold',
                index === 0 ? 'text-primary capitalize' : 'text-primary-text',
              )}
            >
              {item.value || '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
