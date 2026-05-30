import { applicationsQueryKey } from '#/hooks/useApplicationQueries'

import type { QueryClient } from '@tanstack/react-query'

import type { Application, ApplicationStage } from '#/validators/application'

import { useModalStore } from './modal'

/**
 * Celebrate when an application first reaches the `landed` stage.
 *
 * Reads the application's *previous* stage from the cached list (the cache
 * still holds the old value when a mutation's `onSuccess` fires, before the
 * invalidation refetch resolves) so we only fire on a genuine transition and
 * not when re-saving an already-landed application.
 */
export function maybeCelebrateLanded(
  queryClient: QueryClient,
  applicationId: string,
  newStage: ApplicationStage,
): boolean {
  if (newStage !== 'landed') return false

  const apps = queryClient.getQueryData<Application[]>(applicationsQueryKey)
  const app = apps?.find((a) => a.id === applicationId)

  if (app?.stage === 'landed') return false

  useModalStore.getState().open('applicationLanded', {
    applicationId,
    company: app?.company ?? '',
    role: app?.role ?? '',
  })

  return true
}
