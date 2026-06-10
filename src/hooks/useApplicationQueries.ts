import type {
  ApplicationInput,
  DeleteApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationStageInput,
} from '#/types'

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
  updateApplicationStage,
} from '#/server/applications'

import { parseError } from '#/lib/error'
import { maybeCelebrateLanded } from '#/lib/store/landed'
import { openUsageLimitModal } from '#/lib/store/usage-limit'
import { notify } from '#/lib/toast'

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
    mutationFn: (value: ApplicationInput) => createApplication({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
    onError: (error) => {
      if (parseError(error).code === 'GENERATION_LIMIT_REACHED') {
        openUsageLimitModal(queryClient, 'application')
        return
      }
      notify.fromError(error, 'Could not add application')
    },
  })
}

export function useUpdateApplicationMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateApplicationInput) =>
      updateApplication({ data: { ...values, id: applicationId } }),
    onSuccess: async (_, values) => {
      const celebrated = await maybeCelebrateLanded(
        queryClient,
        applicationId,
        values.stage,
      )

      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })

      if (!celebrated) notify.success('Application updated')
    },
    onError: (error) => {
      notify.fromError(error, 'Could not update application')
    },
  })
}

export function useUpdateApplicationStageMutation(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UpdateApplicationStageInput) =>
      updateApplicationStage({ data: values }),
    onSuccess: async (_, values) => {
      const celebrated = await maybeCelebrateLanded(
        queryClient,
        applicationId,
        values.stage,
      )

      queryClient.invalidateQueries({
        queryKey: applicationQueryKey(applicationId),
      })
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })

      if (!celebrated) {
        notify.info(
          'Status Update',
          `Moved to ${values.stage.charAt(0).toUpperCase() + values.stage.slice(1).replace('_', ' ')}`,
        )
      }
    },
    onError: (error) => {
      notify.fromError(error, 'Could not update stage')
    },
  })
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: DeleteApplicationInput) =>
      deleteApplication({ data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
      navigate({ to: '/app' })
      notify.success('Application Update', 'Application deleted')
    },
    onError: (error) => {
      notify.fromError(error, 'Could not delete application')
    },
  })
}
