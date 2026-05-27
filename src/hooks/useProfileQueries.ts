import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { getProfile, saveProfile, updateProfile } from '#/server/profile'

import type { PilotProfile } from '#/lib/db/schema'

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
    },
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: PilotProfileInput) => updateProfile({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}
