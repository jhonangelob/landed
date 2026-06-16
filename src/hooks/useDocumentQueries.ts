import { LOW_GENERATION_THRESHOLD } from '#/config'
import type { ExportDocumentInput, GenerateDocumentInput } from '#/types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  exportCvPdf,
  generateDocuments,
  getDocumentHistory,
  getDocuments,
} from '#/server/documents'

import { parseError } from '#/lib/error'
import { openUsageLimitModal } from '#/lib/store/usage-limit'
import { notify } from '#/lib/toast'

import { subscriptionQueryKey } from './useSubscriptionQueries'

export const documentsQueryKey = (applicationId: string | undefined) =>
  ['generated_docs', applicationId] as const

export const documentHistoryQueryKey = (applicationId: string | undefined) =>
  ['generated_docs', applicationId, 'history'] as const

export function useDocumentsQuery(applicationId: string | undefined) {
  return useQuery({
    queryKey: documentsQueryKey(applicationId),
    queryFn: () => getDocuments({ data: { id: applicationId } }),
    enabled: !!applicationId,
  })
}

export function useDocumentsHistoryQuery(applicationId: string | undefined) {
  return useQuery({
    queryKey: documentHistoryQueryKey(applicationId),
    queryFn: () => getDocumentHistory({ data: { id: applicationId } }),
    enabled: !!applicationId,
  })
}

export function useGenerateDocumentsMutation(applicationId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: GenerateDocumentInput) =>
      generateDocuments({ data: value }),
    onMutate: (variables) => {
      const fileName =
        variables.type === 'cv'
          ? 'CV'
          : variables.type === 'cover_letter'
            ? 'Cover Letter'
            : 'CV and Cover Letter'

      const toastId = notify.loading(
        'Generating documents',
        `Tailoring your ${fileName} to this role...`,
      )
      return { toastId }
    },
    onSuccess: (data, variables, context) => {
      const id = applicationId ?? variables.applicationId

      queryClient.invalidateQueries({ queryKey: documentsQueryKey(id) })
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey })

      notify.dismiss(context.toastId)
      notify.generationDone()

      const { usage } = data

      if (!usage.unlimited && usage.remaining <= LOW_GENERATION_THRESHOLD) {
        notify.headsUp(usage.remaining, usage.resetAt)
      }
    },
    onError: (error, _variables, context) => {
      notify.dismiss(context?.toastId)

      const { code, message } = parseError(error)

      if (code === 'GENERATION_LIMIT_REACHED') {
        openUsageLimitModal(queryClient, 'generation')
        return
      }

      if (code === 'RATE_LIMIT_EXCEEDED') {
        notify.error('Slow down a moment', message)
        return
      }

      notify.fromError(error, 'Could not generate documents')
    },
  })
}

export function useExportDocumentsMutation() {
  return useMutation({
    mutationFn: (value: ExportDocumentInput) =>
      notify.promise(exportCvPdf({ data: value }), {
        loading: 'Exporting document...',
        success: 'Export ready, Your PDF download has started.',
        error: 'Could not export document',
      }),
  })
}
