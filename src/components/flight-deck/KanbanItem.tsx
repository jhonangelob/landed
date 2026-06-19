import { useState } from 'react'

import { getDaysInStage, getStaleness } from '#/helper/application'
import { formatNumberCompact } from '#/helper/number'
import type { Application, ApplicationWithDocStatus } from '#/types'
import { FileTextIcon } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

import { KANBAN_COLUMNS } from '#/constants/stage'

export interface KanbanItemProps {
  data: ApplicationWithDocStatus
}

export type KanbanItemBadgeProps = {
  label: string
  variant: string
}

function StaleFlag({ data }: { data: Application }) {
  const staleness = getStaleness(data)
  if (staleness === 'fresh') return null

  const days = getDaysInStage(data)

  return (
    <span
      title={`${days} days in this stage — time to follow up`}
      className={cn(
        'ml-auto flex shrink-0 items-center gap-1 text-nowrap',
        staleness === 'very_stale' ? 'text-danger-strong' : 'text-warning',
      )}
    >
      <span className="h-1.25 w-1.25 rounded-full bg-current" />
      {days}d
    </span>
  )
}

export default function KanbanItem({ data }: KanbanItemProps) {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)

  const stageColor =
    KANBAN_COLUMNS.find((col) => col.stage === data.stage)?.color ?? '#94a3b8'

  const handleClickApplicationItem = () => {
    navigate({ to: '/app/co-pilot', search: { applicationId: data.id } })
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('applicationId', data.id)
        e.dataTransfer.effectAllowed = 'move'
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={handleClickApplicationItem}
      className={cn(
        'hover:border-red/70 border-divider/50 flex flex-row justify-between rounded-lg border bg-white px-3.5 pt-3.5 pb-3 transition-opacity md:flex-col',
        isDragging ? 'cursor-grabbing opacity-40' : 'cursor-grab',
      )}
    >
      <div className="hidden flex-col gap-1 border-b border-dashed pb-2 md:flex">
        <p className="font-display text-primary-text truncate text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
          {data.role}
        </p>
        <p className="text-muted flex flex-row items-center font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          <span className="truncate">{data.company}</span>·{' '}
          <span className="text-nowrap">
            {new Date(data.spottedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
          <StaleFlag data={data} />
        </p>
      </div>
      <div className="hidden flex-row items-center justify-between pt-2 md:flex">
        <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-medium">
          ₱{formatNumberCompact(Number(data.salaryRange))}
        </p>
        <div className="just flex flex-row items-end gap-1">
          <div
            className="mb-1 h-1.25 w-1.25 rounded-full"
            style={{ backgroundColor: stageColor }}
          />
          <p className="text-muted font-sans text-[12px] leading-[1.4] font-normal">
            {data.status || 'Spotted'}
          </p>

          {data.hasDocuments && (
            <FileTextIcon className="text-primary/80 size-4 rounded-full" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 md:hidden">
        <p className="font-display text-primary-text truncate text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
          {data.role}
        </p>
        <p className="text-muted flex flex-row items-center font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          <span className="truncate">{data.company}</span>·{' '}
          <span className="text-nowrap">
            {data.appliedAt
              ? new Date(data.appliedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })
              : ''}
          </span>
          <StaleFlag data={data} />
        </p>
      </div>

      <div className="flex flex-col items-end justify-between md:hidden">
        <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-medium">
          ₱{formatNumberCompact(Number(data.salaryRange))}
        </p>
        <div className="flex flex-row items-end gap-1">
          <div
            className="mb-1 h-1.25 w-1.25 rounded-full"
            style={{ backgroundColor: stageColor }}
          />
          <p className="text-muted font-sans text-[12px] leading-[1.4] font-normal">
            {data.status || 'Spotted'}
          </p>
        </div>
      </div>
    </div>
  )
}
