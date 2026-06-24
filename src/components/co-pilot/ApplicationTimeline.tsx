import { getDaysSince, getTimeSince } from '#/helper/date'
import { formatNumberCompact } from '#/helper/number'
import type { Application } from '#/types'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import { KANBAN_COLUMNS } from '#/constants/stage'

export const description = 'Application timeline'

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

interface ApplicationTimelineProps {
  application: Application
  generatedDocuments: number
}

export default function ApplicationTimeline({
  application,
  generatedDocuments,
}: ApplicationTimelineProps) {
  const data = [
    { stage: 'spotted', date: application.spottedAt, index: 0, placeholder: 0 },
    {
      stage: 'applied',
      date: application.appliedAt ?? undefined,
      index: application.appliedAt ? 1 : undefined,
      placeholder: 1,
    },
    {
      stage: 'in_flight',
      date: application.inFlightAt ?? undefined,
      index: application.inFlightAt ? 2.5 : undefined,
      placeholder: 2.5,
    },
    {
      stage: 'interview',
      date: application.interviewAt ?? undefined,
      index: application.interviewAt ? 3.6 : undefined,
      placeholder: 3.6,
    },
    {
      stage: 'offer',
      date: application.offerAt ?? undefined,
      index: application.offerAt ? 4.5 : undefined,
      placeholder: 4.5,
    },
    {
      stage: 'landed',
      date: application.landedAt ?? undefined,
      index: application.landedAt ? 5 : undefined,
      placeholder: 5,
    },
  ]

  const atStage =
    application.stage === 'in_flight' ? 'inFlightAt' : `${application.stage}At`

  const stagesToLand =
    KANBAN_COLUMNS.length -
    1 -
    KANBAN_COLUMNS.findIndex((item) => item.stage === application.stage)

  return (
    <div>
      <div className="mb-6 flex flex-row items-end justify-between">
        <div className="space-y-1">
          <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
            Flight Profile
          </p>
          <p className="font-display text-primary text-[22px] leading-none font-bold tracking-[-0.6px] capitalize">
            {application.stage}
          </p>
        </div>
        <p className="text-ink-strong font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
          {stagesToLand} stages to landed
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        style={{ height: '140px', width: '100%', marginBlock: '20px' }}
      >
        <LineChart data={data}>
          <CartesianGrid vertical={false} horizontal={false} />

          <ReferenceLine
            y={5}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth={1}
          />

          <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />

          <XAxis
            dataKey="stage"
            tickLine={false}
            axisLine={false}
            style={{
              color: '#2c3a52',
              textTransform: 'uppercase',
              font: 'DM Mono',
              fontSize: '10px',
              lineHeight: 1.4,
              letterSpacing: '0.4px',
            }}
            tickMargin={14}
            tick={(props) => {
              const { x, y, payload } = props

              const isActive = payload.value === application.stage

              return (
                <text
                  x={x}
                  y={Number(y) + 12}
                  textAnchor="middle"
                  fill={isActive ? '#0091ff' : '#94a3b8'}
                  fontWeight={isActive ? 700 : 400}
                  fontSize={10}
                  fontFamily="DM Mono"
                  style={{ textTransform: 'uppercase' }}
                >
                  {payload.value}
                </text>
              )
            }}
          />

          <YAxis
            dataKey="index"
            tickLine={false}
            axisLine={false}
            domain={[0, 5]}
            ticks={[0, 5]}
            tick={true}
            width={50}
            textAnchor="end"
            tickMargin={10}
            style={{
              color: '#6b7a92',
              textTransform: 'uppercase',
              font: 'DM Mono',
              fontSize: '9px',
              lineHeight: 1.4,
              letterSpacing: '0.8px',
            }}
            tickFormatter={(value) => {
              if (value === 0) return 'GND'
              if (value === 5) return 'FLD 370'
              return 'GND'
            }}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-primary/80 text-white shadow-none!"
                formatter={(value) => {
                  const date = data.find(
                    (item) => item.placeholder === value,
                  )?.date

                  if (date) {
                    return new Date(date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })
                  } else {
                    return 'Not reached'
                  }
                }}
              />
            }
          />

          <Line
            dataKey="placeholder"
            type="monotone"
            stroke="#d1d5db"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            connectNulls={false}
            tooltipType="none"
          />

          <Line
            dataKey="index"
            type="monotone"
            stroke="#0091ff"
            strokeWidth={2}
            connectNulls={false}
            dot
          />
        </LineChart>
      </ChartContainer>
      <div className="divide-border divide grid grid-cols-4 divide-x divide-solid border-t py-2">
        <div className="space-y-1">
          <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.1px] uppercase">
            Days in stage
          </p>
          <p className="font-display text-ink-strong text-[16px] leading-[1.1] font-bold tracking-[-0.4px]">
            {getDaysSince(
              application[atStage as keyof typeof application] ?? 'N/A',
            )}
          </p>
        </div>
        <div className="space-y-1 pl-4">
          <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.1px] uppercase">
            Salary
          </p>
          <p className="font-display text-ink-strong text-[16px] leading-[1.1] font-bold tracking-[-0.4px]">
            ₱{formatNumberCompact(Number(application.salaryRange))}
          </p>
        </div>
        <div className="space-y-1 pl-4">
          <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.1px] uppercase">
            Last Updated
          </p>
          <p className="font-display text-ink-strong text-[16px] leading-[1.1] font-bold tracking-[-0.4px]">
            {getTimeSince(application.updatedAt)}
          </p>
        </div>
        <div className="space-y-1 pl-4">
          <p className="text-muted font-mono text-[9px] leading-[1.4] tracking-[1.1px] uppercase">
            Docs Generated
          </p>
          <p className="font-display text-ink-strong text-[16px] leading-[1.1] font-bold tracking-[-0.4px]">
            {generatedDocuments}
          </p>
        </div>
      </div>
    </div>
  )
}
