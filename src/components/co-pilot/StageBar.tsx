import React from 'react'

import type { ApplicationStage } from '#/types'
import { CheckIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

import { KANBAN_COLUMNS } from '#/constants/stage'

import { Button } from '../ui/button'

interface StageBarProps {
  stage: ApplicationStage
  onUpdateStage: (stage: ApplicationStage) => void
}

export default function StageBar({ stage, onUpdateStage }: StageBarProps) {
  const currentIndex = KANBAN_COLUMNS.findIndex((col) => col.stage === stage)

  return (
    <div className="hidden w-full flex-row items-center gap-4 rounded-lg border bg-white px-6 py-2 md:flex">
      {KANBAN_COLUMNS.map((item, index) => {
        const isPast = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <React.Fragment key={item.stage}>
            <Button
              type="button"
              className="flex h-fit flex-col hover:bg-transparent disabled:opacity-100"
              variant="ghost"
              onClick={() => onUpdateStage(item.stage)}
              disabled={item.stage === stage || stage === 'landed'}
            >
              <div
                className={cn(
                  'flex min-h-7 min-w-7 items-center justify-center rounded-full border font-mono text-[12px] leading-[1.4] font-semibold',
                  isCurrent &&
                    'bg-primary border-primary outline-primary/20 text-white outline-4',
                  isPast && 'border-primary bg-primary text-white',
                  !isCurrent && !isPast && 'text-muted-foreground',
                )}
              >
                {isPast ? <CheckIcon /> : index + 1}
              </div>
              <span
                className={cn(
                  'font-mono text-[11px] leading-[1.4] tracking-[0.8px] uppercase',
                  isCurrent && 'text-primary font-semibold',
                  isPast && 'text-primary font-medium',
                  !isCurrent && !isPast && 'text-muted font-normal',
                )}
              >
                {item.stage}
              </span>
            </Button>
            {index < KANBAN_COLUMNS.length - 1 && (
              <div
                className={cn(
                  'h-px flex-1 border-t',
                  index < currentIndex ? 'border-primary' : 'border-dashed',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
