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
      <div className="flex-1 flex flex-col">
        <p className="font-display font-bold text-[18px] md:text-[32px] text-primary">
          {title}
        </p>
        <p className="font-sans font-medium  text-[12px] md:text-[14px] text-muted-foreground">
          {description}
        </p>
      </div>
      {extra && <div className="mt-auto">{extra}</div>}
    </div>
  )
}
