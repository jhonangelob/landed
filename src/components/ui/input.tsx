import * as React from 'react'

import { ExternalLinkIcon } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const inputClassName = cn(
    'border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 bg-surface-subtle h-10.5 w-full min-w-0 rounded-lg border px-3 py-1 text-[13px] shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[14px]',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 focus:border-[#2ea5f5]',
    className,
  )

  if (type === 'url') {
    const value = typeof props.value === 'string' ? props.value : ''
    const trimmed = value.trim()
    const canOpen = trimmed !== '' && !props.disabled
    const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

    return (
      <div className="relative w-full">
        <input
          type={type}
          data-slot="input"
          className={cn(inputClassName, 'pr-10')}
          {...props}
        />
        <button
          type="button"
          aria-label="Open URL in a new tab"
          disabled={!canOpen}
          onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
          className="text-muted-foreground hover:text-primary bg-primary/10 absolute top-1/2 right-1.5 flex size-7 w-fit -translate-y-1/2 items-center justify-center rounded-lg border-none px-3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ExternalLinkIcon className="text-primary size-3" />
        </button>
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={inputClassName}
      {...props}
    />
  )
}

export { Input }
