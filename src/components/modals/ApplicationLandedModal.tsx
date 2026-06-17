import { useEffect, useState } from 'react'

import { formatDate } from '#/helper/date'
import { formatNumberCompact } from '#/helper/number'
import confetti from 'canvas-confetti'
import { CheckIcon, ChevronRightIcon, CopyIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

interface ApplicationLandedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: string
  role: string
  userName: string
  planTier?: string
  previousCompany?: string
  previousRole?: string
  appliedAt: string | Date | null
  landedAt: string | Date
  compensation?: string
  location?: string
  appliedCount: number
  interviewedCount: number
  daysCount: number
  shareToken?: string
}

function getCompanyCode(name: string) {
  return name.slice(0, 3).toUpperCase()
}

export default function ApplicationLandedModal({
  open,
  onOpenChange,
  company,
  role,
  userName,
  planTier = 'Economy',
  previousCompany,
  previousRole,
  appliedAt,
  landedAt,
  compensation,
  location,
  appliedCount,
  interviewedCount,
  daysCount,
  shareToken,
}: ApplicationLandedModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareToken}`
    : null

  useEffect(() => {
    if (!open) return

    const CONFETTI_DURATION = 5 * 1000
    const end = Date.now() + CONFETTI_DURATION
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

    const zIndex = 9999

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    let rafId: number

    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
        zIndex,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
        zIndex,
      })
      rafId = requestAnimationFrame(frame)
    }
    frame()

    const fireworkDefaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex,
    }
    const fireworksInterval = setInterval(() => {
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

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(fireworksInterval)
    }
  }, [open])

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] space-y-2.25 overflow-y-auto bg-white px-4 py-6 sm:px-6 lg:max-w-5xl lg:px-10 lg:pt-8.5 lg:pb-6.5"
      >
        <DialogHeader className="flex flex-row items-center">
          <DialogTitle className="text-primary flex flex-row items-center gap-1 font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.1px] uppercase">
            status
            <ChevronRightIcon className="size-3" /> Landed
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="font-display text-primary-text text-center text-[44px] leading-[0.95] font-bold tracking-[-1.5px] sm:text-[56px] md:text-[72px] md:tracking-[-2.5px]">
          You <span className="text-primary italic">landed</span>.
        </DialogDescription>

        <p className="text-ink-muted mx-auto max-w-130 text-center font-sans text-[15px] leading-normal">
          Final descent confirmed at{' '}
          <span className="font-bold">{company}</span> for the{' '}
          <span className="font-bold">{role}</span> role. Wheels down.
        </p>

        <div className="flex flex-col rounded-lg border lg:flex-row">
          <div className="border-divider bg-surface-muted flex-1 border-b border-dashed px-5 py-6 lg:border-r lg:border-b-0 lg:px-6.5">
            <div className="flex flex-row justify-between pb-4">
              <div>
                <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.7px] uppercase">
                  Arrival Ticket
                </p>
                <p className="text-primary-text font-mono text-[19px] leading-[1.4] font-medium tracking-[1.5px] uppercase">
                  {userName}
                </p>
              </div>
              <div className="text-end">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.4px]">
                  Class
                </p>
                <p className="text-primary font-mono text-[14px] leading-[1.4] font-semibold tracking-[2.0px] uppercase">
                  {planTier}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between border-y py-4">
              <div className="w-1/3 space-y-1">
                <p className="text-primary-text font-mono text-[34px] leading-none font-medium tracking-[1.7px] uppercase sm:text-[42px]">
                  {previousCompany ? getCompanyCode(previousCompany) : '---'}
                </p>
                <p className="text-primary-text font-display truncate text-[16px] leading-[1.4] font-bold tracking-[-0.4px]">
                  {previousCompany ?? '—'}
                </p>
                <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[0.8px] uppercase">
                  {previousRole ?? '—'}
                </p>
              </div>
              <img src="/assets/airplane-1.svg" className="my-auto h-14" />
              <div className="w-1/3 space-y-1 text-end">
                <p className="text-primary font-mono text-[34px] leading-none font-medium tracking-[1.7px] uppercase sm:text-[42px]">
                  {getCompanyCode(company)}
                </p>
                <p className="text-primary-text font-display truncate text-[16px] leading-[1.4] font-bold tracking-[-0.4px]">
                  {company}
                </p>
                <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[0.8px] uppercase">
                  {role}
                </p>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-x-8 gap-y-3 pt-4 lg:gap-12">
              <div className="space-y-1">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                  departed
                </p>
                <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                  {appliedAt ? formatDate(appliedAt) : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                  Arrived
                </p>
                <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                  {formatDate(landedAt)}
                </p>
              </div>
              {compensation && (
                <div className="space-y-1">
                  <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                    Comp
                  </p>
                  <p className="text-primary font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                    ₱{formatNumberCompact(Number(compensation))}
                  </p>
                </div>
              )}
              {location && (
                <div className="space-y-1">
                  <p className="text-muted font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
                    Location
                  </p>
                  <p className="text-primary-text font-sans leading-[1.2] font-bold tracking-[-0.4px]">
                    {location}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-surface-info w-full space-y-6 px-5.5 py-6 lg:w-55">
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Stub
              </p>
              <p className="border-primary py-.5 text-primary -rotate-5 rounded-md border px-2 font-mono text-[11px] leading-[1.4] font-bold tracking-[2.2px]">
                LANDED
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Applied
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {appliedCount}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Interviewed
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {interviewedCount}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-muted font-mono text-[11px] leading-[1.4] tracking-[1.7px] uppercase">
                Days
              </p>
              <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-medium">
                {daysCount}
              </p>
            </div>
            <div className="space-y-2">
              {shareUrl && (
                <div className="flex justify-center">
                  <QRCodeSVG value={shareUrl} size={88} bgColor="transparent" />
                </div>
              )}
              <p className="text-muted text-center font-mono text-[9px] leading-[1.4] tracking-[0.9px]">
                LND·{formatDate(landedAt)}·{getCompanyCode(company)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-subtle flex flex-col gap-4 rounded-lg border px-5 py-4 sm:flex-row sm:justify-between sm:gap-2">
          <div className="space-y-1.5 sm:w-1/2">
            <p className="text-primary-text font-display text-[18px] leading-[1.4] font-bold tracking-[-0.5px]">
              Tell the tower.
            </p>
            <p className="text-muted font-sans text-[13px] leading-normal font-normal">
              90% of Landed users who share their landing refer a friend within
              a week. Karma.
            </p>
          </div>
          <div className="flex w-full flex-row items-end gap-2 sm:w-auto">
            {/* <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
              disabled={!shareUrl}
              onClick={handlePostToX}
            >
              <TwitterIcon />
              Post to X
            </Button>
            <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
              disabled={!shareUrl}
              onClick={handlePostToLinkedIn}
            >
              <LinkedinIcon />
              Post to LinkedIn
            </Button> */}
            <Button
              className="text-primary-text w-full font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase sm:w-auto"
              variant="outline"
              disabled={!shareUrl}
              onClick={handleCopyLink}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between! border-t pt-4 sm:justify-center">
          <Button
            variant="ghost"
            className="text-muted font-mono text-[12px] leading-[1.4] font-normal tracking-[1.1px] uppercase hover:bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Back to the deck
          </Button>
          {/* <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handleViewFlightDeck}
          >
            Invite 3 friends, get a month free
            <ArrowRightIcon />
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
