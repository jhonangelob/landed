import { useState } from 'react'

import { formatNumberCompact } from '#/helper/number'
import type { Application } from '#/types'

import { useNavigate } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

import { KANBAN_COLUMNS } from '#/constants/stage'

export interface KanbanItemProps {
  data: Application
}

export type KanbanItemBadgeProps = {
  label: string
  variant: string
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
        'hover:border-primary/70 border-divider/50 flex flex-row justify-between rounded-lg border bg-white px-3.5 pt-3.5 pb-3 transition-opacity md:flex-col',
        isDragging ? 'cursor-grabbing opacity-40' : 'cursor-grab',
      )}
    >
      <div className="hidden flex-col gap-1 border-b border-dashed pb-2 md:flex">
        <p className="font-display text-primary-text truncate text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
          {data.role}
        </p>
        <p className="text-muted flex flex-row font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          <span className="truncate">{data.company}</span>·{' '}
          <span className="text-nowrap">
            {data.appliedAt
              ? new Date(data.appliedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })
              : ''}
          </span>
        </p>
      </div>

      <div className="hidden flex-row items-center justify-between pt-2 md:flex">
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

      <div className="flex flex-col gap-1 md:hidden">
        <p className="font-display text-primary-text truncate text-[15px] leading-[1.3] font-bold tracking-[-0.1px]">
          {data.role}
        </p>
        <p className="text-muted flex flex-row font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          <span className="truncate">{data.company}</span>·{' '}
          <span className="text-nowrap">
            {data.appliedAt
              ? new Date(data.appliedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })
              : ''}
          </span>
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
