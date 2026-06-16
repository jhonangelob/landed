import { useState } from 'react'

import {
  useQuickApplicationMutation,
  useUpdateApplicationStageMutation,
} from '#/hooks/useApplicationQueries'
import type {
  Application,
  ApplicationStage,
  QuickApplicationInput,
} from '#/types'

import { useNavigate } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

import { KANBAN_COLUMNS } from '#/constants/stage'

import KanbanItem from './KanbanItem'
import QuickAddField from './QuickAddField'

interface KanbanBoardProps {
  applications: Application[]
  query?: string
}

function matchesQuery(app: Application, query: string) {
  const q = query.toLowerCase()
  return (
    app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
  )
}

export default function KanbanBoard({
  applications,
  query = '',
}: KanbanBoardProps) {
  const navigate = useNavigate()

  const isFiltering = query.trim() !== ''

  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState('')

  const [quickAddFields, setQuickAddFields] = useState<QuickApplicationInput>({
    company: '',
    role: '',
  })

  const { mutateAsync: createApplication } = useQuickApplicationMutation()

  const { mutate: updateStage } =
    useUpdateApplicationStageMutation(applicationId)

  const handleNewApplication = (stage: ApplicationStage) => {
    navigate({ to: '/app/co-pilot', search: { stage } })
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stage)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null)
    }
  }

  const handleDrop = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault()
    setDragOverStage(null)
    const id = e.dataTransfer.getData('applicationId')
    setApplicationId(id)
    if (!id) return
    const app = applications.find((a) => a.id === id)
    if (!app || app.stage === stage) return
    updateStage({ id: id, stage })
  }

  const handleQuickAdd = () => {
    createApplication(quickAddFields)
    setQuickAddFields({
      company: '',
      role: '',
    })
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-250px)] flex-1 flex-col gap-6">
      <div className="flex max-h-[calc(100vh-300px)] min-h-0 flex-1 flex-row gap-2.5 overflow-auto pr-12 pb-6">
        {KANBAN_COLUMNS.map((col, index) => {
          const colApps = applications.filter((a) => a.stage === col.stage)
          const visibleCount = isFiltering
            ? colApps.filter((a) => matchesQuery(a, query)).length
            : colApps.length
          const isOver = dragOverStage === col.stage

          return (
            <div
              key={index}
              className="flex flex-col gap-4.5"
              onDragOver={(e) => handleDragOver(e, col.stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.stage)}
            >
              <div className="flex flex-row items-center justify-between gap-2 border-b pb-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <p className="text-ink-strong font-sans text-[13px] leading-[1.4] font-semibold tracking-[-0.1px]">
                  {col.label}
                </p>
                <div className="text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[11px] leading-4">
                  {visibleCount}
                </div>
              </div>
              <div
                className={cn(
                  'flex w-60 flex-1 flex-col rounded-lg pb-2 transition-colors',
                  isOver && 'bg-accent/60 ring-primary ring-1',
                )}
              >
                {index === 0 && (
                  <QuickAddField
                    onSubmit={handleQuickAdd}
                    value={quickAddFields}
                    onChange={setQuickAddFields}
                  />
                )}

                {colApps.map((application) => {
                  const visible =
                    !isFiltering || matchesQuery(application, query)
                  return (
                    <div
                      key={application.id}
                      className="grid transition-all duration-200"
                      style={{
                        gridTemplateRows: visible ? '1fr' : '0fr',
                        opacity: visible ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-2">
                          <KanbanItem data={application} />
                        </div>
                      </div>
                    </div>
                  )
                })}

                {index + 1 !== KANBAN_COLUMNS.length && (
                  <div
                    className="group hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-2 text-center hover:bg-white"
                    onClick={() => handleNewApplication(col.stage)}
                  >
                    <p className="text-muted group-hover:text-primary font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase">
                      Add
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
