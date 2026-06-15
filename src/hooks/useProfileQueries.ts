import type { PilotProfileInput } from '#/types'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { getProfile, saveProfile } from '#/server/profile'

import { parseError } from '#/lib/error'
import { notify } from '#/lib/toast'

export const profileQueryKey = ['profile'] as const

export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: profileQueryKey,
    queryFn: () => getProfile(),
  })
}

export function useSaveProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: PilotProfileInput) =>
      notify.promise(saveProfile({ data: value }), {
        loading: 'Saving profile...',
        success: 'Profile saved',
        error: (err) => parseError(err).message || 'Could not save profile',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}
