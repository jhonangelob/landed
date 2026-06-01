import { applicationsQueryKey } from '#/hooks/useApplicationQueries'
import { profileQueryKey } from '#/hooks/useProfileQueries'
import { subscriptionQueryKey } from '#/hooks/useSubscriptionQueries'

import type { QueryClient } from '@tanstack/react-query'

import type { PilotProfile } from '#/lib/db/schema'

import type { Application, ApplicationStage } from '#/validators/application'

import { getPlanById } from '#/constants/plan'

import { useModalStore } from './modal'

const MS_PER_DAY = 1000 * 60 * 60 * 24

/** Stages that mean the application was actually submitted (past `spotted`). */
const APPLIED_STAGES: ApplicationStage[] = [
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
]

/** Stages that mean the application reached at least the interview round. */
const INTERVIEWED_STAGES: ApplicationStage[] = ['interview', 'offer', 'landed']

/**
 * Celebrate when an application first reaches the `landed` stage.
 *
 * Reads the application's *previous* stage from the cached list (the cache
 * still holds the old value when a mutation's `onSuccess` fires, before the
 * invalidation refetch resolves) so we only fire on a genuine transition and
 * not when re-saving an already-landed application.
 *
 * Builds a one-time snapshot for the boarding-pass modal from data already in
 * the query cache (applications, subscription, pilot profile). Anything not yet
 * cached degrades gracefully — the modal hides the optional fields.
 */
export function maybeCelebrateLanded(
  queryClient: QueryClient,
  applicationId: string,
  newStage: ApplicationStage,
): boolean {
  if (newStage !== 'landed') return false

  const apps =
    queryClient.getQueryData<Application[]>(applicationsQueryKey) ?? []
  const app = apps.find((a) => a.id === applicationId)

  if (app?.stage === 'landed') return false

  const landedAt = new Date()
  const appliedAt = app?.appliedAt ? new Date(app.appliedAt) : null

  const appliedCount = apps.filter((a) =>
    APPLIED_STAGES.includes(a.stage),
  ).length
  const interviewedCount = apps.filter((a) =>
    INTERVIEWED_STAGES.includes(a.stage),
  ).length
  const daysCount = appliedAt
    ? Math.max(
        0,
        Math.round((landedAt.getTime() - appliedAt.getTime()) / MS_PER_DAY),
      )
    : 0

  const subscription = queryClient.getQueryData<{ planId: string } | null>(
    subscriptionQueryKey,
  )
  const planTier = getPlanById(subscription?.planId ?? 'economy').name

  const profile = queryClient.getQueryData<PilotProfile | null>(profileQueryKey)
  const currentJob = profile?.experience?.[0]

  useModalStore.getState().open('applicationLanded', {
    applicationId,
    company: app?.company ?? '',
    role: app?.role ?? '',
    planTier,
    previousCompany: currentJob?.company,
    previousRole: currentJob?.role,
    appliedAt,
    landedAt,
    compensation: app?.salaryRange ?? undefined,
    location: app?.location ?? undefined,
    appliedCount,
    interviewedCount,
    daysCount,
  })

  return true
}
