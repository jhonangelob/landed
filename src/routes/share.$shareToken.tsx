import { formatDate } from '#/helper/date'
import { formatNumberCompact } from '#/helper/number'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'

import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import type { StatsSnapshot } from '#/server/touchdown'
import { getTouchdownShare } from '#/server/touchdown'

export const Route = createFileRoute('/share/$shareToken')({
  head: ({ loaderData }) => {
    const snap = loaderData.statsSnapshot as StatsSnapshot
    return {
      meta: [
        { title: `${loaderData.userName} just landed at ${snap.company}!` },
        {
          name: 'description',
          content: `${loaderData.userName} applied to ${snap.appliedCount} roles and landed the ${snap.role} position at ${snap.company} in ${snap.daysCount} days.`,
        },
        {
          property: 'og:title',
          content: `${loaderData.userName} just landed at ${snap.company}!`,
        },
        {
          property: 'og:description',
          content: `${snap.appliedCount} applications · ${snap.daysCount} days · ${snap.role} at ${snap.company}`,
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
      ],
    }
  },
  loader: async ({ params }) => {
    const share = await getTouchdownShare({
      data: { shareToken: params.shareToken },
    })
    if (!share) throw notFound()
    return share
  },
  notFoundComponent: ShareNotFound,
  component: SharePage,
})

function getCompanyCode(name: string) {
  return name.slice(0, 3).toUpperCase()
}

function SharePage() {
  const share = Route.useLoaderData()
  const snap = share?.statsSnapshot as StatsSnapshot

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-row items-center gap-1 font-mono text-[11px] font-semibold tracking-[1.1px] text-zinc-400 uppercase">
          status
          <ChevronRightIcon className="size-3" /> Landed
        </div>

        <h1 className="font-display text-primary-text text-[56px] leading-[0.95] font-bold tracking-[-2px]">
          They <span className="text-primary italic">landed</span>.
        </h1>

        <p className="text-ink-muted max-w-lg font-sans text-[15px] leading-normal">
          Final descent confirmed at{' '}
          <span className="font-bold">{snap.company}</span> for the{' '}
          <span className="font-bold">{snap.role}</span> role. Wheels down.
        </p>

        {/* Boarding Pass */}
        <div className="flex flex-row rounded-lg border">
          <div className="border-divider bg-surface-muted flex-1 border-r border-dashed px-6 py-6">
            <div className="flex flex-row justify-between pb-4">
              <div>
                <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.7px] uppercase">
                  Arrival Ticket
                </p>
                <p className="text-primary-text font-mono text-[19px] leading-[1.4] font-medium tracking-[1.5px] uppercase">
                  {share.userName}
                </p>
              </div>
              <div className="text-end">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.4px]">
                  Class
                </p>
                <p className="text-primary font-mono text-[14px] leading-[1.4] font-semibold tracking-[2.0px] uppercase">
                  {snap.planTier}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between border-y py-4">
              <div className="w-1/3 space-y-1">
                <p className="text-primary-text font-mono text-[42px] leading-none font-medium tracking-[1.7px] uppercase">
                  {snap.previousCompany
                    ? getCompanyCode(snap.previousCompany)
                    : '---'}
                </p>
                <p className="text-primary-text font-display truncate text-[16px] leading-[1.4] font-bold tracking-[-0.4px]">
                  {snap.previousCompany ?? '—'}
                </p>
                <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[0.8px] uppercase">
                  {snap.previousRole ?? '—'}
                </p>
              </div>
              <img src="/assets/airplane-1.svg" className="my-auto h-14" />
              <div className="w-1/3 space-y-1 text-end">
                <p className="text-primary font-mono text-[42px] leading-none font-medium tracking-[1.7px] uppercase">
                  {getCompanyCode(snap.company)}
                </p>
                <p className="text-primary-text font-display truncate text-[16px] leading-[1.4] font-bold tracking-[-0.4px]">
                  {snap.company}
                </p>
                <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[0.8px] uppercase">
                  {snap.role}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-12 pt-4">
              <div className="space-y-1">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                  departed
                </p>
                <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                  {snap.appliedAt ? formatDate(snap.appliedAt) : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                  Arrived
                </p>
                <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                  {formatDate(snap.landedAt)}
                </p>
              </div>
              {snap.compensation && (
                <div className="space-y-1">
                  <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                    Comp
                  </p>
                  <p className="text-primary font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                    ₱{formatNumberCompact(Number(snap.compensation))}
                  </p>
                </div>
              )}
              {snap.location && (
                <div className="space-y-1">
                  <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                    Location
                  </p>
                  <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                    {snap.location}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-surface-info w-48 space-y-6 px-5 py-6">
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Stub
              </p>
              <p className="border-primary text-primary -rotate-5 rounded-md border px-2 py-0.5 font-mono text-[11px] leading-[1.4] font-bold tracking-[2.2px]">
                LANDED
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Applied
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {snap.appliedCount}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Interviewed
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {snap.interviewedCount}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Days
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {snap.daysCount}
              </p>
            </div>
            <div>
              <p className="text-muted text-center font-mono text-[9px] leading-[1.4] tracking-[0.9px]">
                LND·{formatDate(snap.landedAt)}·{getCompanyCode(snap.company)}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-subtle flex flex-row items-center justify-between gap-4 rounded-lg border px-5 py-4">
          <div>
            <p className="text-primary-text font-display text-[18px] leading-[1.4] font-bold tracking-[-0.5px]">
              Track your own job search.
            </p>
            <p className="text-muted font-sans text-[13px] leading-normal font-normal">
              Landed helps you track applications, generate tailored CVs, and
              land faster.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/">
              Try Landed free
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ShareNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-primary-text text-[42px] leading-[0.95] font-bold tracking-[-1.5px]">
        Flight not found.
      </p>
      <p className="text-ink-muted font-sans text-[15px]">
        This boarding pass doesn't exist or has been removed.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Go to Landed</Link>
      </Button>
    </div>
  )
}
