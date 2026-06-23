import { useEffect, useState } from 'react'

import { formatDate } from '#/helper/date'
import { formatNumberCompact } from '#/helper/number'
import confetti from 'canvas-confetti'
import { ArrowRightIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import type { TouchdownShare } from '#/server/touchdown'
import { getTouchdownShare } from '#/server/touchdown'

import { cn } from '#/lib/utils'

export const Route = createFileRoute('/share/$shareToken')({
  head: ({ loaderData }) => {
    // head can run before loader data resolves, so it may be undefined here.
    const data = loaderData as TouchdownShare | undefined
    if (!data) return {}
    const snap = data.statsSnapshot
    return {
      meta: [
        { title: `${data.userName} just landed at ${snap.company}!` },
        {
          name: 'description',
          content: `${data.userName} applied to ${snap.appliedCount} roles and landed the ${snap.role} position at ${snap.company} in ${snap.daysCount} days.`,
        },
        {
          property: 'og:title',
          content: `${data.userName} just landed at ${snap.company}!`,
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
  loader: async ({ params }): Promise<TouchdownShare> => {
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
  // Loader throws notFound() when the share is missing, so it is always defined
  // here — but the notFound path widens the inferred type to include undefined.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const share = Route.useLoaderData() as TouchdownShare
  const { shareToken } = Route.useParams()
  const snap = share.statsSnapshot

  const apiUrl = window.location.origin
  const shareUrl = `${apiUrl}/share/${shareToken}`

  const [isCelebrating, setIsCelebrating] = useState(true)

  useEffect(() => {
    const CONFETTI_DURATION = 5 * 1000
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    let rafId: number
    let fireworksInterval: ReturnType<typeof setInterval>
    let stopTimeout: ReturnType<typeof setTimeout>

    const fire = () => {
      setIsCelebrating(true)
      const end = Date.now() + CONFETTI_DURATION

      const frame = () => {
        if (Date.now() > end) return
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors,
        })
        rafId = requestAnimationFrame(frame)
      }
      frame()

      const fireworkDefaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
      }
      fireworksInterval = setInterval(() => {
        const timeLeft = end - Date.now()
        if (timeLeft <= 0) return clearInterval(fireworksInterval)

        const particleCount = 50 * (timeLeft / CONFETTI_DURATION)
        confetti({
          ...fireworkDefaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors,
        })
        confetti({
          ...fireworkDefaults,
          particleCount,
          origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 },
          colors,
        })
      }, 250)

      stopTimeout = setTimeout(() => setIsCelebrating(false), CONFETTI_DURATION)
    }

    fire()

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(fireworksInterval)
      clearTimeout(stopTimeout)
    }
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white px-4 pt-4 pb-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h1 className="font-display text-primary-text text-[36px] leading-none font-bold tracking-[-1.2px] md:text-[56px] md:leading-[0.95] md:tracking-[-2px]">
          Just <span className="text-primary italic">landed!</span>
        </h1>

        <p className="text-ink-muted max-w-lg font-sans text-[15px] leading-normal">
          Final descent confirmed at{' '}
          <span className="font-bold">{snap.company}</span> for the{' '}
          <span className="font-bold">{snap.role}</span> role. Wheels down.
        </p>

        {/* Boarding Pass */}
        <div
          className={cn(
            'z-10 flex flex-col overflow-hidden rounded-xl border md:flex-row',
            isCelebrating && 'wiggle',
          )}
        >
          <div className="border-divider bg-surface-muted flex-1 border-b border-dashed px-6 py-6 md:border-r md:border-b-0">
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
            <div className="flex flex-1 flex-row justify-between border-y py-4">
              <div className="w-1/3 space-y-1">
                <p className="text-primary-text font-mono text-[34px] leading-none font-medium tracking-[1.7px] uppercase sm:text-[42px]">
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
                <p className="text-primary font-mono text-[34px] leading-none font-medium tracking-[1.7px] uppercase sm:text-[42px]">
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
            <div className="flex flex-row flex-wrap gap-x-8 gap-y-3 pt-4 md:gap-12">
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
          <div className="bg-surface-info relative w-full space-y-4 px-5 py-6 md:w-48">
            <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full border bg-white" />
            <div className="absolute -bottom-7 -left-3 h-6 w-6 rounded-full border bg-white" />
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

            <div className="mx-auto flex justify-center">
              <QRCodeSVG value={shareUrl} size={88} bgColor="transparent" />
            </div>

            <div>
              <p className="text-muted text-center font-mono text-[9px] leading-[1.4] tracking-[0.9px]">
                LND·{formatDate(snap.landedAt)}·{getCompanyCode(snap.company)}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4 rounded-lg border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-primary-text font-display text-[18px] leading-[1.4] font-bold tracking-[-0.5px]">
              Track your own job search.
            </p>
            <p className="text-muted font-sans text-[13px] leading-normal font-normal">
              Landed helps you track applications, generate tailored CVs, and
              land faster.
            </p>
          </div>
          <Button asChild className="w-full shrink-0 sm:w-auto">
            <Link to="/" className="justify-center text-white!">
              Try Landed for free
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
