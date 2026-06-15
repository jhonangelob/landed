import { useAiUsageStatsQuery } from '#/hooks/useAdminQueries'

import { cn } from '#/lib/utils'

import type { AdminStatsPeriod } from '#/validators/admin'

const KIND_LABEL: Record<string, string> = {
  cv: 'CV',
  cover_letter: 'Cover letter',
  profile_parse: 'Profile parse',
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border px-4 py-3">
      <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <p className="text-primary-text font-display mt-1 text-[22px] leading-none font-bold tracking-tight">
        {value}
      </p>
    </div>
  )
}

export default function AiUsagePanel({
  period,
  isFetching,
}: {
  period: AdminStatsPeriod
  isFetching?: boolean
}) {
  const { data } = useAiUsageStatsQuery(period)

  if (!data) return null

  return (
    <div
      className={cn('space-y-4 transition-opacity', isFetching && 'opacity-60')}
    >
      <div>
        <p className="text-muted-foreground font-mono text-[11px] font-medium tracking-[1.3px] uppercase">
          Claude API Usage
        </p>
        <p className="text-muted mt-0.5 font-sans text-[13px]">
          Token consumption and estimated cost for Co-Pilot generations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Requests" value={data.requests.toLocaleString()} />
        <Stat label="Total tokens" value={data.totalTokens.toLocaleString()} />
        <Stat label="Input tokens" value={data.inputTokens.toLocaleString()} />
        <Stat
          label="Output tokens"
          value={data.outputTokens.toLocaleString()}
        />
        <Stat
          label="Est. cost"
          value={`$${data.estimatedCostUsd.toFixed(2)}`}
        />
      </div>

      {data.byKind.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 text-right font-medium">Requests</th>
                <th className="px-4 py-2.5 text-right font-medium">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.byKind.map((row) => (
                <tr key={row.kind} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5">
                    {KIND_LABEL[row.kind] ?? row.kind}
                  </td>
                  <td className="text-muted-foreground px-4 py-2.5 text-right">
                    {row.requests.toLocaleString()}
                  </td>
                  <td className="text-muted-foreground px-4 py-2.5 text-right">
                    {row.totalTokens.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
