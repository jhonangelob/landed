interface SectionHeader {
  subTitle: string
  title1: string
  title2: string
  description: string
}

export default function SectionHeader({
  subTitle,
  title1,
  title2,
  description,
}: SectionHeader) {
  return (
    <div className="border-b pt-1.5 pb-8.5">
      <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3px] uppercase">
        {subTitle}
      </p>
      <p className="font-display text-primary-text text-[26px] leading-[1.10] font-bold tracking-[-0.7px]">
        {title1} <span className="text-primary italic">{title2}.</span>
      </p>
      <p className="text-muted pt-1.5 font-sans text-[14px] leading-normal">
        {description}
      </p>
    </div>
  )
}
