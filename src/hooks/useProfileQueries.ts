import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { getProfile, saveProfile } from '#/server/profile'

import type { PilotProfile } from '#/lib/db/schema'
import { notify } from '#/lib/toast'

import type { PilotProfileInput } from '#/validators/profile'

export const profileQueryKey = ['profile'] as const

export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: profileQueryKey,
    queryFn: (): Promise<PilotProfile | null> => getProfile(),
  })
}

export function useSaveProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: PilotProfileInput) => saveProfile({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
      notify.success('Profile updated', 'Your Pilot Profile has been saved')
    },
    onError: (error) => {
      notify.fromError(error, 'Could not update profile')
    },
  })
}
