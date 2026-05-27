import type { ApplicationStage } from '#/validators/application'

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
