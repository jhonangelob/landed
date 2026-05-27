import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
  updateApplicationStage,
} from '#/server/applications'

import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateStageInput,
} from '#/validators/application'
import { useNavigate } from '@tanstack/react-router'

export const applicationsQueryKey = ['applications'] as const
export const applicationQueryKey = (id: string) => ['application', id] as const

export function useApplicationsQuery() {
  return useSuspenseQuery({
    queryKey: applicationsQueryKey,
    queryFn: () => getApplications(),
  })
}

export function useApplicationQuery(id: string | undefined) {
  return useQuery({
    queryKey: applicationQueryKey(id ?? ''),
    queryFn: () => getApplicationById({ data: { id: id! } }),
    enabled: !!id,
  })
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: CreateApplicationInput) =>
      createApplication({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export function useUpdateApplicationMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateApplicationInput) =>
      updateApplication({ data: { ...values, id: applicationId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export function useUpdateApplicationStageMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateStageInput) =>
      updateApplicationStage({ data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  })
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => deleteApplication({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
      navigate({ to: '/flight-deck' })
    },
  })
}
