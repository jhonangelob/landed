import { useState } from 'react'
import { parseCvFile } from '#/server/profile'
import type { PilotProfileInput } from '#/types'
import { notify } from '#/lib/toast'

export function useParseCvMutation() {
  const [isParsing, setIsParsing] = useState(false)
  const [data, setData] = useState<Partial<PilotProfileInput> | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const parse = async (file: File) => {
    setIsParsing(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const fileContent = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          '',
        ),
      )
      const parsePromise = parseCvFile({
        data: { fileContent, fileType: file.type },
      })
      notify.promise(parsePromise, {
        loading: 'Parsing CV…',
        success: 'CV parsed successfully',
        error: 'Failed to parse CV',
      })
      const parsed = await parsePromise
      setData(parsed)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsParsing(false)
    }
  }

  return { parse, isParsing, data, error }
}
