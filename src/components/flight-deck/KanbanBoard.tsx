import { useState } from 'react'

import { SORT_OPTIONS, sortApplications } from '#/helper/application'
import type { SortKey } from '#/helper/application'
import { useUpdateApplicationStageMutation } from '#/hooks/useApplicationQueries'
import type { ApplicationStage, ApplicationWithDocStatus } from '#/types'
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  ListFilterIcon,
  SearchIcon,
} from 'lucide-react'

import { cn } from '#/lib/utils'

import {
  ARCHIVE_COLUMN,
  ARCHIVE_STAGES,
  KANBAN_COLUMNS,
} from '#/constants/stage'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import BoardSummary from './BoardSummary'
import KanbanItem from './KanbanItem'
import QuickAddField from './QuickAddField'

interface KanbanBoardProps {
  applications: ApplicationWithDocStatus[]
}

function matchesQuery(app: ApplicationWithDocStatus, query: string) {
  const q = query.toLowerCase()
  return (
    app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q)
  )
}

export default function KanbanBoard({ applications }: KanbanBoardProps) {
  const [query, setQuery] = useState('')
  const isFiltering = query.trim() !== ''

  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState('')
  const [selectedStage, setSelectedStage] = useState<ApplicationStage | 'all'>(
    'all',
  )
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [showArchive, setShowArchive] = useState(false)

  const { mutate: updateStage } =
    useUpdateApplicationStageMutation(applicationId)

  const matchesStageAndQuery = (
    a: ApplicationWithDocStatus,
    stage: ApplicationStage | 'all',
  ) =>
    (stage === 'all' || a.stage === stage) &&
    (!isFiltering || matchesQuery(a, query))

  const mobileApps = sortApplications(
    applications.filter((a) => matchesStageAndQuery(a, selectedStage)),
    sortKey,
  )

  const stageCount = (stage: ApplicationStage | 'all') =>
    applications.filter((a) => matchesStageAndQuery(a, stage)).length

  const visibleColumns = [
    ...(selectedStage === 'all'
      ? KANBAN_COLUMNS
      : KANBAN_COLUMNS.filter((col) => col.stage === selectedStage)),
    ...(showArchive ? [ARCHIVE_COLUMN] : []),
  ]

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

  const handleDrop = (
    e: React.DragEvent,
    stage: ApplicationStage | 'archived',
  ) => {
    e.preventDefault()
    setDragOverStage(null)
    if (stage === 'archived') return
    const id = e.dataTransfer.getData('applicationId')
    setApplicationId(id)
    if (!id) return
    const app = applications.find((a) => a.id === id)
    if (!app || app.stage === stage) return
    updateStage({ id: id, stage })
  }

  return (
    <div className="flex h-full max-h-[calc(100vh-280px)] flex-1 flex-col gap-4 md:max-h-[calc(100vh-250px)]">
      <div className="hidden h-12 flex-row items-center justify-between gap-3 rounded-lg border bg-white px-3.5 py-3 md:flex">
        <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
          <SearchIcon className="stroke-muted size-4 shrink-0" />
          <Input
            className="h-5 border-none bg-transparent"
            placeholder="Search by company or role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2">
          <BoardSummary applications={applications} />

          <Select
            value={selectedStage}
            onValueChange={(value) =>
              setSelectedStage(value as ApplicationStage | 'all')
            }
          >
            <SelectTrigger
              size="sm"
              className="gap-1.5 border-none! text-[13px]!"
            >
              <ListFilterIcon className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              avoidCollisions={false}
            >
              <SelectItem value="all" className="text-[13px]!">
                All stages
              </SelectItem>
              {KANBAN_COLUMNS.map((col) => (
                <SelectItem
                  key={col.stage}
                  value={col.stage}
                  className="text-[13px]!"
                >
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
          >
            <SelectTrigger
              size="sm"
              className="gap-1.5 border-none! text-[13px]!"
            >
              <ArrowUpDownIcon className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="end"
              avoidCollisions={false}
            >
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-[13px]!"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={showArchive}
            onClick={() => setShowArchive((v) => !v)}
            className={cn(
              'gap-1.5 rounded-full text-[13px] font-normal',
              showArchive && 'border-[#64748b] bg-[#64748b] text-white',
            )}
          >
            <ArchiveIcon className="size-3.5" />
            Show Archive
          </Button>
        </div>
      </div>

      <div className="hidden max-h-[calc(100vh-300px)] min-h-0 flex-1 gap-4 overflow-x-auto pb-6 md:flex">
        {visibleColumns.map((col) => {
          const isArchive = col.stage === 'archived'
          const colStages = isArchive ? ARCHIVE_STAGES : [col.stage]
          const colApps = sortApplications(
            applications.filter((a) => colStages.includes(a.stage)),
            sortKey,
          )
          const visibleCount = isFiltering
            ? colApps.filter((a) => matchesQuery(a, query)).length
            : colApps.length
          const isOver = dragOverStage === col.stage

          return (
            <div
              key={col.stage}
              className="flex min-h-0 w-56 shrink-0 flex-col gap-4.5"
              onDragOver={
                isArchive ? undefined : (e) => handleDragOver(e, col.stage)
              }
              onDragLeave={isArchive ? undefined : handleDragLeave}
              onDrop={isArchive ? undefined : (e) => handleDrop(e, col.stage)}
            >
              <div className="sticky flex flex-row items-center justify-between gap-2 border-b pb-2">
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
                  'flex min-h-0 w-full flex-1 scrollbar-none flex-col overflow-y-auto rounded-lg border border-transparent pb-2 transition-colors',
                  isOver && 'border-primary bg-accent/10 border-dashed',
                )}
              >
                {col.stage === 'spotted' && (
                  <QuickAddField className="sticky top-0" />
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
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 md:hidden">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border bg-white px-3">
            <SearchIcon className="stroke-muted size-4 shrink-0" />
            <Input
              className="h-5 border-none bg-transparent"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
          >
            <SelectTrigger size="sm" className="h-9 gap-1.5">
              <ArrowUpDownIcon className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex scrollbar-none gap-1 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedStage('all')}
            className={cn(
              'flex h-6.5 items-center rounded-full border px-2.5 font-sans text-[11px] leading-[1.4] font-medium text-nowrap transition-colors',
              selectedStage === 'all'
                ? 'border-primary bg-primary text-white'
                : 'text-muted bg-white',
            )}
          >
            All
            <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-60">
              {stageCount('all')}
            </span>
          </button>
          {KANBAN_COLUMNS.map((item) => (
            <button
              key={item.stage}
              type="button"
              onClick={() => setSelectedStage(item.stage)}
              className={cn(
                'flex h-6.5 items-center rounded-full border px-2.5 font-sans text-[11px] leading-[1.4] font-medium text-nowrap transition-colors',
                selectedStage === item.stage
                  ? 'border-primary bg-primary text-white'
                  : 'text-muted bg-white',
              )}
            >
              {item.label}
              <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-60">
                {stageCount(item.stage)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pb-6">
          {mobileApps.length === 0 ? (
            <p className="text-muted py-10 text-center font-mono text-[11px] tracking-[1.1px] uppercase">
              No applications
            </p>
          ) : (
            mobileApps.map((application) => {
              const col = KANBAN_COLUMNS.find(
                (c) => c.stage === application.stage,
              )
              return (
                <div key={application.id} className="flex flex-col gap-1.5">
                  {selectedStage === 'all' && (
                    <div className="flex items-center gap-1.5 px-0.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: col?.color }}
                      />
                      <span className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1px] uppercase">
                        {col?.label ?? application.stage}
                      </span>
                    </div>
                  )}
                  <KanbanItem data={application} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
