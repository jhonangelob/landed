import { useMutation } from '@tanstack/react-query'

import { parseCvFile } from '#/server/profile'

import { parseError } from '#/lib/error'
import { notify } from '#/lib/toast'

export function useParseCvMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const arrayBuffer = await file.arrayBuffer()
      const fileContent = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          '',
        ),
      )

      // `file.type` is a MIME string (e.g. "application/pdf"); the server
      // expects the 'pdf' | 'docx' discriminator.
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')

      const parsePromise = parseCvFile({
        data: { fileContent, fileType: isPdf ? 'pdf' : 'docx' },
      })

      notify.promise(parsePromise, {
        loading: 'Parsing CV…',
        success: 'CV parsed successfully',
        error: 'Failed to parse CV',
      })

      return parsePromise
    },

    onError: (error, _variables) => {
      const { code, message } = parseError(error)

      if (code === 'RATE_LIMIT_EXCEEDED') {
        notify.error('Slow down a moment', message)
        return
      }
    },
  })
}
