import { useState } from 'react'

import { createFileRoute, redirect } from '@tanstack/react-router'

import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'

import AiUsagePanel from '#/components/admin/AiUsagePanel'
import MetricCard from '#/components/admin/MetricCard'
import SubscriptionCodes from '#/components/admin/SubscriptionCodes'
import SectionHeader from '#/components/layout/SectionHeader'

import { adminStatsQueryKey, useAdminStatsQuery } from '#/hooks/useAdminQueries'

import { getAdminStats } from '#/server/admin'
import { getSession } from '#/server/session'

import { cn } from '#/lib/utils'

import type { AdminStatsPeriod } from '#/validators/admin'

const DEFAULT_PERIOD: AdminStatsPeriod = '30d'

const PERIODS: { value: AdminStatsPeriod; label: string; days: number }[] = [
  { value: '7d', label: '7 days', days: 7 },
  { value: '30d', label: '30 days', days: 30 },
  { value: '90d', label: '90 days', days: 90 },
]

const peso = (n: number) => `₱${n.toLocaleString()}`

export const Route = createFileRoute('/(admin)/admin')({
  head: () => ({
    meta: [
      {
        title: 'Landed | Mission Control',
      },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()

    if (session?.user.role !== 'admin') {
      throw redirect({ to: '/app' })
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: adminStatsQueryKey(DEFAULT_PERIOD),
      queryFn: () => getAdminStats({ data: { period: DEFAULT_PERIOD } }),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const [period, setPeriod] = useState<AdminStatsPeriod>(DEFAULT_PERIOD)
  const { data, isFetching } = useAdminStatsQuery(period)

  const days = PERIODS.find((p) => p.value === period)?.days ?? 30
  const context = `vs prev ${days}d`

  return (
    <div className="section">
      <SectionHeader
        subTitle="Operations Overview"
        title1="Mission"
        title2="Control"
        description="How Landed is flying — users, revenue and platform usage at a glance."
      />

      <Tabs
        value={period}
        onValueChange={(value) => setPeriod(value as AdminStatsPeriod)}
      >
        <TabsList>
          {PERIODS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {data && (
        <div
          className={cn(
            'grid grid-cols-1 gap-3 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
            isFetching && 'opacity-60',
          )}
        >
          <MetricCard
            label="Total users"
            value={data.totalUsers.total.toLocaleString()}
            delta={data.totalUsers.delta}
            context={context}
          />
          <MetricCard
            label="Active subscribers"
            value={data.activeSubscribers.total.toLocaleString()}
            delta={data.activeSubscribers.delta}
            context={context}
          />
          <MetricCard
            label="Revenue"
            value={peso(data.revenue.total)}
            delta={data.revenue.delta}
            context={context}
          />
          <MetricCard
            label="Applications created"
            value={data.applications.total.toLocaleString()}
            delta={data.applications.delta}
            context={context}
          />
          <MetricCard
            label="AI generations"
            value={data.aiGenerations.total.toLocaleString()}
            delta={data.aiGenerations.delta}
            context={context}
          />
        </div>
      )}

      <AiUsagePanel period={period} isFetching={isFetching} />

      <SubscriptionCodes />
    </div>
  )
}
