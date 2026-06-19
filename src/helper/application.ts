import type { Application, ApplicationStage } from '#/types'

/** Timestamp column marking when an application entered each stage. */
type StageTimestampKey =
  | 'spottedAt'
  | 'appliedAt'
  | 'inFlightAt'
  | 'interviewAt'
  | 'offerAt'
  | 'landedAt'
  | 'rejectedAt'
  | 'withdrawnAt'

const STAGE_ENTERED_KEY: Record<ApplicationStage, StageTimestampKey> = {
  spotted: 'spottedAt',
  applied: 'appliedAt',
  in_flight: 'inFlightAt',
  interview: 'interviewAt',
  offer: 'offerAt',
  landed: 'landedAt',
  rejected: 'rejectedAt',
  withdrawn: 'withdrawnAt',
}

/** Stages where a stale nudge is meaningful — terminal stages are excluded. */
const ACTIVE_STAGES = new Set<ApplicationStage>([
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
])

const STALE_DAYS = 14
const VERY_STALE_DAYS = 30
const MS_PER_DAY = 86_400_000

export function isActiveStage(stage: ApplicationStage): boolean {
  return ACTIVE_STAGES.has(stage)
}

/** When the application last entered its current stage (falls back to update/create time). */
export function getStageEnteredAt(app: Application): Date {
  const ts = app[STAGE_ENTERED_KEY[app.stage]]
  return new Date(ts ?? app.updatedAt)
}

export function getDaysInStage(app: Application): number {
  const diff = Date.now() - getStageEnteredAt(app).getTime()
  return Math.max(0, Math.floor(diff / MS_PER_DAY))
}

export type Staleness = 'fresh' | 'stale' | 'very_stale'

/** A card is only "stale" while it sits, unmoved, in a non-terminal stage. */
export function getStaleness(app: Application): Staleness {
  if (!isActiveStage(app.stage)) return 'fresh'
  const days = getDaysInStage(app)
  if (days >= VERY_STALE_DAYS) return 'very_stale'
  if (days >= STALE_DAYS) return 'stale'
  return 'fresh'
}

export type SortKey = 'newest' | 'oldest' | 'company' | 'stale'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'company', label: 'Company A–Z' },
  { value: 'stale', label: 'Most stale' },
]

export function sortApplications(
  apps: Application[],
  key: SortKey,
): Application[] {
  const sorted = [...apps]
  switch (key) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    case 'company':
      return sorted.sort((a, b) => a.company.localeCompare(b.company))
    case 'stale':
      return sorted.sort(
        (a, b) =>
          getStageEnteredAt(a).getTime() - getStageEnteredAt(b).getTime(),
      )
  }
}
