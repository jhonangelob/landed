import * as React from 'react'

import { cn } from '#/lib/utils.ts'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 bg-surface-muted flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-[13px] shadow-none transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[14px]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
