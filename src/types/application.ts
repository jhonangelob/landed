import type { ApplicationStatus } from '#/lib/db/schema'

export enum ApplicationStatusEnum {
  SPOTTED = 'spotted',
  APPLIED = 'applied',
  IN_FLIGHT = 'in_flight',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  LANDED = 'landed',
}

export interface Application {
  id: string
  userId: string
  company: string
  role: string
  status: ApplicationStatus
  subStatus: string | null
  jobUrl: string | null
  jobPostText: string | null
  notes: string | null
  salaryRange: string | null
  location: string | null

  appliedAt: Date | null
  interviewAt: Date | null
  offerAt: Date | null
  landedAt: Date | null
  rejectedAt: Date | null

  createdAt: Date
  updatedAt: Date
}

export interface KanbanColumn {
  status: ApplicationStatusEnum
  label: string
  color: string
  dot: string
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    status: ApplicationStatusEnum.SPOTTED,
    label: 'Spotted',
    color: '#94a3b8',
    dot: 'bg-status-spotted',
  },
  {
    status: ApplicationStatusEnum.APPLIED,
    label: 'Applied',
    color: '#0ea5e9',
    dot: 'bg-status-applied',
  },
  {
    status: ApplicationStatusEnum.IN_FLIGHT,
    label: 'In Flight',
    color: '#7c3aed',
    dot: 'bg-status-in-flight',
  },
  {
    status: ApplicationStatusEnum.INTERVIEW,
    label: 'Interview',
    color: '#d97706',
    dot: 'bg-status-interviewing',
  },
  {
    status: ApplicationStatusEnum.OFFER,
    label: 'Offer',
    color: '#059669',
    dot: 'bg-status-offer',
  },
  {
    status: ApplicationStatusEnum.LANDED,
    label: 'Landed',
    color: '#059669',
    dot: 'bg-status-landed',
  },
]

export type ApplicationsByStatus = Record<ApplicationStatusEnum, Application[]>

export interface FlightDeckStats {
  total: number
  interviews: number
  offers: number
  responseRate: string
}
