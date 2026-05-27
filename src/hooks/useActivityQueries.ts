import { useSuspenseQuery } from '@tanstack/react-query'

import { getActivities } from '#/server/activity'

export const activitiesQueryKey = ['activities'] as const

export function useActivitiesQuery() {
  return useSuspenseQuery({
    queryKey: activitiesQueryKey,
    queryFn: () => getActivities(),
  })
}
