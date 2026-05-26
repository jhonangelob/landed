import type { Application } from '#/lib/db/schema'

interface ApplicationSummaryProps {
  data: Application
}
export default function ApplicationSummary({ data }: ApplicationSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-md border bg-[#f5f6f8] p-4">
        <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          Current Stage
        </p>
        <p className="font-display text-primary text-[19px] leading-[1.4] font-bold tracking-[-0.5px]">
          {data.status}
        </p>
      </div>
      <div className="rounded-md border bg-[#f5f6f8] p-4">
        <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          Current Stage
        </p>
        <p className="font-display text-primary text-[19px] leading-[1.4] font-bold tracking-[-0.5px]">
          {data.status}
        </p>
      </div>
      <div className="rounded-md border bg-[#f5f6f8] p-4">
        <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          Current Stage
        </p>
        <p className="font-display text-primary text-[19px] leading-[1.4] font-bold tracking-[-0.5px]">
          {data.status}
        </p>
      </div>
      <div className="rounded-md border bg-[#f5f6f8] p-4">
        <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          Current Stage
        </p>
        <p className="font-display text-primary text-[19px] leading-[1.4] font-bold tracking-[-0.5px]">
          {data.status}
        </p>
      </div>
      <div className="rounded-md border bg-[#f5f6f8] p-4">
        <p className="text-muted font-mono text-[10px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
          Current Stage
        </p>
        <p className="font-display text-primary text-[19px] leading-[1.4] font-bold tracking-[-0.5px]">
          {data.status}
        </p>
      </div>
    </div>
  )
}
