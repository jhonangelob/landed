import { useUpdateSubscriptionMutation } from '#/hooks/useSubscriptionQueries'
import {
  CreditCardIcon,
  MoveRightIcon,
  MoveUpIcon,
  PlusIcon,
} from 'lucide-react'

import { useModal } from '#/lib/store/modal'

import type { Plan } from '#/validators/subscription'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

interface UpdateSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: Plan
  newPlan: Plan
  currentExpiresAt?: Date | string | null
}

export default function UpdateSubscriptionModal({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  currentExpiresAt,
}: UpdateSubscriptionModalProps) {
  const { close } = useModal()
  const { mutateAsync: upgrade, isPending } = useUpdateSubscriptionMutation()

  const accessThrough = newPlan.duration
    ? new Date(Date.now() + newPlan.duration * DAY_MS)
    : null

  const expiresAt = currentExpiresAt ? new Date(currentExpiresAt) : null
  const daysLeftInCycle =
    expiresAt && expiresAt.getTime() > Date.now()
      ? Math.ceil((expiresAt.getTime() - Date.now()) / DAY_MS)
      : null

  async function handleUpgrade() {
    try {
      await upgrade(newPlan.id)
      close()
    } catch {
      // Surfaced by the mutation's onError handler.
    }
  }

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
        <div className="flex flex-row justify-between rounded-lg border bg-[#f5f6f8] px-5 py-4.5">
          <div className="space-y-0.5">
            <p className="text-muted-foreground font-mono text-[9px] leading-[1.4] font-normal tracking-[1.3px] uppercase">
              Current
            </p>
            <p className="font-mono text-[26px] leading-none font-medium tracking-[1.6px] text-[#2c3a52] uppercase">
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
            <p className="font-mono text-[26px] leading-none font-medium tracking-[1.6px] text-[#2c3a52] uppercase">
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
                className="flex flex-row items-center gap-1 font-sans text-[13px] leading-[1.2] text-[#2c3a52]"
              >
                <PlusIcon className="text-primary size-2.5 stroke-4" />
                {feature}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-lg border bg-[#f5f6f8]">
          <div className="flex h-11 flex-row items-center justify-between border-b border-dashed p-3">
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-[#2c3a52]">
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
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-[#2c3a52]">
              Effective
            </p>
            <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-normal tracking-[0.3px]">
              Immediately
            </p>
          </div>
          <div className="flex h-11 flex-row items-center justify-between border-b border-dashed p-3">
            <p className="font-sans text-[13px] leading-[1.4] font-normal text-[#2c3a52]">
              Access through
            </p>{' '}
            <p className="text-primary-text font-mono text-[13px] leading-[1.4] font-normal tracking-[0.3px]">
              {accessThrough
                ? `${formatAccessDate(accessThrough)} · renew manually`
                : '—'}
            </p>
          </div>
          <div className="flex h-11 flex-row items-center justify-between bg-[#c2c2c2]/10 p-3">
            <p className="flex items-center gap-2 font-mono text-[12px] leading-[1.4] font-normal tracking-[0.9px] text-[#2c3a52]">
              <CreditCardIcon className="size-4" /> Charged once to VISA
              ····{' '}
            </p>
            <p className="cursor-pointer font-mono text-[12px] leading-[1.4] font-normal tracking-[0.9px] text-[#0f1b2d] underline">
              Change
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-primary-text font-mono text-[12px] leading-[1.4] font-normal tracking-[1.1px] uppercase hover:bg-transparent"
            >
              Keep {currentPlan.name}
            </Button>
          </DialogClose>
          <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            disabled={isPending}
            onClick={handleUpgrade}
          >
            {isPending
              ? 'Upgrading...'
              : `Pay ${newPlan.currency} ${newPlan.price} - Upgrade`}
            {!isPending && <MoveRightIcon />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
