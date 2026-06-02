import { MoveUpIcon, PlusIcon } from 'lucide-react'

import type { Plan } from '#/validators/subscription'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

const DAY_MS = 24 * 60 * 60 * 1000

function formatAccessDate(date: Date) {
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
}

interface PlanInformationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: Plan
  newPlan: Plan
  currentExpiresAt?: Date | string | null
}

export default function PlanInformationModal({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  currentExpiresAt,
}: PlanInformationModalProps) {
  const accessThrough = newPlan.duration
    ? new Date(Date.now() + newPlan.duration * DAY_MS)
    : null

  const expiresAt = currentExpiresAt ? new Date(currentExpiresAt) : null
  const daysLeftInCycle =
    expiresAt && expiresAt.getTime() > Date.now()
      ? Math.ceil((expiresAt.getTime() - Date.now()) / DAY_MS)
      : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center">
          <MoveUpIcon className="text-primary size-2.5" />
          <DialogTitle className="text-primary font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.1px] uppercase">
            Cabin upgrade
          </DialogTitle>
          <span className="text-muted-foreground font-mono text-[11px] leading-[1.4] tracking-normal uppercase">
            · Subscription
          </span>
        </DialogHeader>
        <DialogDescription className="font-display text-primary-text text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
          Move to <span className="text-primary italic">{newPlan.name}</span>.
        </DialogDescription>
        <div className="flex flex-row justify-between rounded-lg border bg-surface-muted px-5 py-4.5">
          <div className="space-y-0.5">
            <p className="text-muted-foreground font-mono text-[9px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
              Current
            </p>
            <p className="font-mono text-[26px] leading-none font-medium tracking-[1.6px] text-ink-muted uppercase">
              {currentPlan.id.slice(0, 3)}
            </p>
            <p className="text-primary-text font-sans text-[15px] leading-[1.4] font-bold tracking-[-0.4px]">
              {currentPlan.name}
            </p>
            <p className="text-muted-foreground font-mono text-[10px] leading-[1.4] tracking-[1px] uppercase">
              {currentPlan.price === 0
                ? 'Free'
                : `${currentPlan.currency}${currentPlan.price}/mo`}
            </p>
          </div>

          <img src="/assets/airplane-1.svg" className="my-auto h-14" />

          <div className="space-y-0.5 text-end">
            <p className="text-muted-foreground font-mono text-[9px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
              Upgrading to
            </p>
            <p className="font-mono text-[26px] leading-none font-medium tracking-[1.6px] text-ink-muted uppercase">
              {newPlan.id.slice(0, 3)}
            </p>
            <p className="text-primary-text font-sans text-[15px] leading-[1.4] font-bold tracking-[-0.4px]">
              {newPlan.name}
            </p>
            <p className="text-muted-foreground font-mono text-[10px] leading-[1.4] tracking-[1px] uppercase">
              {newPlan.currency}
              {newPlan.price}/mo
            </p>
          </div>
        </div>
        <div className="bg-primary/10 border-primary/20 space-y-1 rounded-lg border px-4 py-3.5">
          <p className="text-primary font-mono text-[10px] leading-[1.4] font-normal tracking-[1.5px] uppercase">
            You unlock
          </p>
          <div className="grid grid-cols-2 gap-0.5">
            {newPlan.features.map((feature) => (
              <p
                key={feature}
                className="flex flex-row items-center gap-1 font-sans text-[13px] leading-[1.2] text-ink-muted"
              >
                <PlusIcon className="text-primary size-2.5 stroke-4" />
                {feature}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-lg border bg-surface-muted">
          <div className="flex h-11 flex-row items-center justify-between border-b border-dashed p-3">
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-ink-muted">
              One-time charge
              {daysLeftInCycle !== null && (
                <span className="text-muted font-mono text-[10px] leading-[1.4] tracking-[0.6px]">
                  {' · '}
                  {daysLeftInCycle}d left in cycle
                </span>
              )}
            </p>
            <p className="text-primary-text font-mono text-[16px] leading-[1.4] font-bold tracking-[0.3px]">
              {newPlan.currency} {newPlan.price}
            </p>
          </div>
          <div className="flex h-11 flex-row items-center justify-between overflow-hidden border-b border-dashed p-3">
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-ink-muted">
              Effective
            </p>
            <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-normal tracking-[0.3px]">
              Immediately
            </p>
          </div>
          <div className="flex h-11 flex-row items-center justify-between border-b border-dashed p-3">
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-ink-muted">
              Access through
            </p>{' '}
            <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-normal tracking-[0.3px]">
              {accessThrough
                ? `${formatAccessDate(accessThrough)} · renew manually`
                : '—'}
            </p>
          </div>
          <div className="flex h-10 flex-row items-center justify-between bg-neutral-tint/10 p-3"></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
