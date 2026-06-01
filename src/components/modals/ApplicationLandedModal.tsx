import {
  ArrowRightIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { formatNumberCompact } from '#/helper/number'

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
}

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

function getCompanyCode(name: string) {
  return name.slice(0, 3).toUpperCase()
}

function formatDate(date: string | Date) {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function formatTicketDate(date: string | Date) {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  return `${day}${MONTHS[d.getMonth()]}${d.getFullYear()}`
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
}: ApplicationLandedModalProps) {
  const navigate = useNavigate()

  const handleViewFlightDeck = () => {
    onOpenChange(false)
    navigate({ to: '/flight-deck' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="min-w-220 space-y-2.25 bg-white px-10 pt-8.5 pb-6.5"
      >
        <DialogHeader className="flex flex-row items-center">
          <DialogTitle className="text-primary flex flex-row items-center gap-1 font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.1px] uppercase">
            status
            <ChevronRightIcon className="size-3" /> Landed
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="font-display text-primary-text text-center text-[72px] leading-[0.95] font-bold tracking-[-2.5px]">
          You <span className="text-primary italic">landed</span>.
        </DialogDescription>

        <p className="mx-auto max-w-130 text-center font-sans text-[15px] leading-normal text-[#2c3a52]">
          Final descent confirmed at{' '}
          <span className="font-bold">{company}</span> for the{' '}
          <span className="font-bold">{role}</span> role. Wheels down.
        </p>

        <div className="flex flex-row rounded-lg border">
          <div className="flex-1 border-r border-dashed border-[#c7ccd6] bg-[#f5f6f8] px-6.5 py-6">
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
                <p className="text-primary-text font-mono text-[42px] leading-none font-medium tracking-[1.7px] uppercase">
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
                <p className="text-primary font-mono text-[42px] leading-none font-medium tracking-[1.7px] uppercase">
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
            <div className="flex flex-row gap-12 pt-4">
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
          <div className="w-55 space-y-6 bg-[#ebf2f9] px-5.5 py-6">
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
            <div>
              <div></div>
              <p className="text-muted text-center font-mono text-[9px] leading-[1.4] tracking-[0.9px]">
                LND·{formatTicketDate(landedAt)}·{getCompanyCode(company)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-2 rounded-lg border bg-[#fafbfd] px-5 py-4">
          <div className="w-45 space-y-1.5">
            <p className="text-primary-text font-display text-[18px] leading-[1.4] font-bold tracking-[-0.5px]">
              Tell the tower.
            </p>
            <p className="text-muted font-sans text-[13px] leading-normal font-normal">
              90% of Landed users who share their landing refer a friend within
              a week. Karma.
            </p>
          </div>
          <div className="flex flex-row items-end gap-2">
            <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
            >
              <TwitterIcon />
              Post to X
            </Button>
            <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
            >
              <LinkedinIcon />
              Post to LinkedIn
            </Button>
            <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
            >
              <CopyIcon />
              Copy Link
            </Button>
            <Button
              className="text-primary-text font-mono text-[11px] leading-[1.4] tracking-[0.9px] uppercase"
              variant="outline"
            >
              <DownloadIcon />
              Save Image
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
          <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handleViewFlightDeck}
          >
            Invite 3 friends, get a month free
            <ArrowRightIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
