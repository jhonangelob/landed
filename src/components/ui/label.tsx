'use client'

import * as React from 'react'

import { Label as LabelPrimitive } from 'radix-ui'

import { cn } from '#/lib/utils.ts'

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'text-muted-foreground flex items-center gap-2 font-mono text-[10px] leading-none font-medium tracking-[1.3px] uppercase select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 md:text-[12px]',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
