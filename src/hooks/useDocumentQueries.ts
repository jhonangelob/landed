import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  exportCvPdf,
  generateDocuments,
  getDocuments,
} from '#/server/documents'

import type {
  ExportDocumentInput,
  GenerateDocumentInput,
} from '#/validators/documents'

export const documentsQueryKey = (applicationId: string) =>
  ['generated_docs', applicationId] as const

export function useDocumentsQuery(applicationId: string | undefined) {
  return useQuery({
    queryKey: documentsQueryKey(applicationId ?? ''),
    queryFn: () => getDocuments({ data: { id: applicationId! } }),
    enabled: !!applicationId,
  })
}

export function useGenerateDocumentsMutation(applicationId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: GenerateDocumentInput) =>
      generateDocuments({ data: value }),
    onSuccess: (_, variables) => {
      const id = applicationId ?? variables.applicationId
      queryClient.invalidateQueries({ queryKey: documentsQueryKey(id) })
    },
  })
}

export function useExportDocumentsMutation() {
  return useMutation({
    mutationFn: (value: ExportDocumentInput) => exportCvPdf({ data: value }),
  })
}
