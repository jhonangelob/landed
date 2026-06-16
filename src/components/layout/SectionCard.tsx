import { cn } from '#/lib/utils'

interface SectionCardProps {
  variant: 'hangar' | 'profile' | 'profile_secondary' | 'copilot'
  label?: string
  order?: number | string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: any
}

export default function SectionCard({
  variant,
  label,
  order,
  title,
  description,
  children,
  className,
  icon,
}: SectionCardProps) {
  switch (variant) {
    case 'hangar':
      return (
        <div
          className={`flex flex-col rounded-lg border bg-white p-6 shadow-none ${className}`}
        >
          <div className="mb-3.5 flex flex-row items-start justify-between gap-4">
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
              {label}
            </p>
            <div className="text-ink-muted flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-[1.4] tracking-[1.5px]">
              0{order}
            </div>
          </div>
          <p className="font-display text-ink-strong mb-5 text-[22px] leading-[1.4] font-bold tracking-[-0.6px]">
            {title}
          </p>
          <p className="text-muted mb-4.5 font-sans text-[14px] leading-normal font-normal">
            {description}
          </p>
          {children}
        </div>
      )

    case 'copilot':
      return (
        <div
          className={cn(
            'flex flex-col rounded-lg border bg-white p-6 shadow-none',
            className,
          )}
        >
          <div className="mb-4 flex flex-row items-start justify-between gap-4 border-b pb-2">
            <p className="font-display text-[17px] leading-[1.4] font-bold tracking-[-0.4px]">
              {title}
            </p>
            <p className="text-muted rounded-md border px-2 py-0.5 font-mono text-[10px] leading-[1.4] font-normal tracking-[1.4px] uppercase">
              {order}
            </p>
          </div>
          {children}
        </div>
      )

    case 'profile':
      return (
        <div
          className={`flex flex-col rounded-lg border bg-white p-6 shadow-none ${className}`}
        >
          <div className="flex flex-row items-start justify-between gap-4">
            <p className="font-display text-ink-strong text-[22px] leading-[1.4] font-bold tracking-[-0.6px]">
              {title}
            </p>
            <div className="text-ink-muted flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-[1.4] tracking-[1.5px]">
              0{order}
            </div>
          </div>
          <p className="text-muted mb-4.5 font-sans text-[14px] leading-normal font-normal">
            {description}
          </p>
          <div className="flex flex-col gap-3.5 border-t pt-5">{children}</div>
        </div>
      )

    case 'profile_secondary':
      return (
        <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="font-display text-ink-strong flex flex-row items-center gap-3 text-[15px] leading-[1.4] font-bold tracking-[-0.1px]">
              {icon} {title}
            </p>
            <p className="trakcing-[0.9px] text-muted font-mono text-[10px] leading-[1.4] uppercase">
              {label}
            </p>
          </div>
          {children}
        </div>
      )
  }
}
