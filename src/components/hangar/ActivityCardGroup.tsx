const SUBSCRITION_DATA = {
  applications: 32,
  documents: 24,
  interview: 12,
  words: '1.6k',
}

export default function ActivityCardGroup() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="flex h-23.5 flex-col gap-2 rounded-md border bg-[#f5f6f8] px-4 py-3.5 shadow-none">
        <p className="font-display text-[30px] leading-none font-bold tracking-[-0.8px] text-[#0f1b2]">
          {SUBSCRITION_DATA.applications}
        </p>
        <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
          Applications submitted
        </p>
      </div>
      <div className="flex h-23.5 flex-col gap-2 rounded-md border bg-[#f5f6f8] px-4 py-3.5 shadow-none">
        <p className="font-display text-[30px] leading-none font-bold tracking-[-0.8px] text-[#0f1b2]">
          {SUBSCRITION_DATA.documents}
        </p>
        <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
          Documents Generated
        </p>
      </div>
      <div className="flex h-23.5 flex-col gap-2 rounded-md border bg-[#f5f6f8] px-4 py-3.5 shadow-none">
        <p className="font-display text-[30px] leading-none font-bold tracking-[-0.8px] text-[#0f1b2]">
          {SUBSCRITION_DATA.interview}
        </p>
        <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
          Active Interviews
        </p>
      </div>
      <div className="flex h-23.5 flex-col gap-2 rounded-md border bg-[#f5f6f8] px-4 py-3.5 shadow-none">
        <p className="font-display text-[30px] leading-none font-bold tracking-[-0.8px] text-[#0f1b2]">
          {SUBSCRITION_DATA.words}
        </p>
        <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.1px] uppercase">
          Words Tailored
        </p>
      </div>
    </div>
  )
}
