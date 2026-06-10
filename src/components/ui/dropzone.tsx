import { useRef, useState } from 'react'

import { UploadIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

interface DropzoneProps {
  onFileAccepted: (file: File) => void
  accept?: string[]
  maxSize?: number
  disabled?: boolean
  className?: string
}

export function Dropzone({
  onFileAccepted,
  accept = ['.pdf', '.docx'],
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  className,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const validate = (data: File): string | null => {
    const ext = '.' + data.name.split('.').pop()?.toLowerCase()
    if (!accept.includes(ext)) {
      return `File type not supported. Accepted: ${accept.join(', ')}`
    }
    if (data.size > maxSize) {
      return `File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    return null
  }

  const handleFile = (data: File) => {
    const err = validate(data)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setFile(data)
    onFileAccepted(data)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const dropped = e.dataTransfer.files[0]
    handleFile(dropped)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) handleFile(selected)
    e.target.value = ''
  }

  const handleRemove = () => {
    setFile(null)
    setError(null)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'bg-primary/5 hover:bg-primary/10! flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 transition-colors',
          isDragging && 'border-primary bg-primary/5',
          !isDragging &&
            'border-border hover:border-primary/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive',
        )}
      >
        <UploadIcon className="bg-primary/10 text-primary size-10 rounded-full stroke-2 p-3" />
        <div className="text-center">
          <p className="font-display text-ink-strong text-[14px] leading-[1.4] font-bold">
            Drop your CV or <span className="text-primary">browse</span>
          </p>
          <p className="text-muted mt-1 font-mono text-[10px] leading-[1.4] tracking-[0.4px]">
            PDF, DOCX · we will read it and fill the fields
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* error */}
      {error && <p className="text-destructive text-xs">{error}</p>}

      {/* accepted file */}
      {file && !error && (
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <p className="truncate text-sm">{file.name}</p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive ml-2 shrink-0 text-xs"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
