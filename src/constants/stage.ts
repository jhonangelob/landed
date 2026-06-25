import type { ApplicationStage } from '#/types'

export const KANBAN_COLUMNS = [
  {
    stage: 'spotted' as ApplicationStage,
    label: 'Spotted',
    color: '#94a3b8',
  },
  {
    stage: 'applied' as ApplicationStage,
    label: 'Applied',
    color: '#0ea5e9',
  },
  {
    stage: 'in_flight' as ApplicationStage,
    label: 'In Flight',
    color: '#7c3aed',
  },
  {
    stage: 'interview' as ApplicationStage,
    label: 'Interview',
    color: '#d97706',
  },
  {
    stage: 'offer' as ApplicationStage,
    label: 'Offer',
    color: '#059669',
  },
  {
    stage: 'landed' as ApplicationStage,
    label: 'Landed',
    color: '#059669',
  },
]

/** Terminal stages grouped into the single "Archived" column (toggled on). */
export const ARCHIVE_STAGES: ApplicationStage[] = ['rejected', 'withdrawn']

export const ARCHIVE_COLUMN = {
  stage: 'archived' as const,
  label: 'Archived',
  color: '#64748b',
}

/** Days a card can sit in a stage before it's considered stale. */
export const STALE_DAYS: Partial<Record<ApplicationStage, number>> = {
  spotted: 7,
  applied: 14,
  in_flight: 10,
  interview: 7,
  offer: 5,
}
