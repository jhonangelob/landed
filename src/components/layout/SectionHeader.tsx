import type React from 'react'

interface SectionHeader {
  title: string
  description: string
  extra?: React.ReactNode
}

export default function SectionHeader({
  title,
  description,
  extra,
}: SectionHeader) {
  return (
    <div className="flex flex-row">
      <div className="flex flex-1 flex-col">
        <p className="font-display text-primary text-[18px] font-bold md:text-[32px]">
          {title}
        </p>
        <p className="text-muted-foreground font-sans text-[12px] font-medium md:text-[14px]">
          {description}
        </p>
      </div>
      {extra && <div className="mt-auto">{extra}</div>}
    </div>
  )
}
