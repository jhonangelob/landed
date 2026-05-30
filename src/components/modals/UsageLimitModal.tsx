import { formatResetDate } from '#/helper/usage'
import { GaugeIcon, MoveRightIcon, RotateCcwIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

import { useModal } from '#/lib/store/modal'
import type { UsageLimitReason } from '#/lib/store/modal'

import type { PlanId } from '#/validators/subscription'

import { PAID_PLAN, getPlanById } from '#/constants/plan'

interface UsageLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: UsageLimitReason
  planId: PlanId
  used: number
  limit: number
  resetAt: Date | string | null
}

const REASON_COPY: Record<UsageLimitReason, { title: string; body: string }> = {
  generation: {
    title: 'Out of generations',
    body: "You've used every AI generation on your current plan. Upgrade to keep tailoring CVs and cover letters.",
  },
  application: {
    title: 'Application limit reached',
    body: "You've hit the application limit on your current plan. Upgrade to keep tracking new opportunities.",
  },
}

export default function UsageLimitModal({
  open,
  onOpenChange,
  reason,
  planId,
  used,
  limit,
  resetAt,
}: UsageLimitModalProps) {
  const { open: openModal } = useModal()

  const currentPlan = getPlanById(planId)
  const copy = REASON_COPY[reason]

  const handleUpgrade = () => {
    openModal('updateSubscription', {
      currentPlan,
      newPlan: PAID_PLAN,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center">
          <GaugeIcon className="text-destructive size-2.5" />
          <DialogTitle className="text-destructive font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.1px] uppercase">
            {copy.title}
          </DialogTitle>
          <span className="text-muted-foreground font-mono text-[11px] leading-[1.4] tracking-normal uppercase">
            · {currentPlan.name} plan
          </span>
        </DialogHeader>

        <DialogDescription className="font-display text-primary-text text-[28px] leading-[1.1] font-bold tracking-[-0.6px]">
          You're at your <span className="text-destructive italic">limit</span>.
        </DialogDescription>

        <p className="text-muted-foreground font-sans text-[14px] leading-[1.5]">
          {copy.body}
        </p>

        <div className="flex flex-col gap-3 rounded-lg border bg-[#f5f6f8] p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-muted-foreground font-mono text-[10px] leading-[1.4] tracking-[1.3px] uppercase">
              Used this cycle
            </p>
            <p className="text-primary-text font-mono text-[13px] font-bold tracking-[0.3px]">
              {used} / {limit}
            </p>
          </div>
          <div className="bg-muted-foreground/15 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-destructive h-full rounded-full"
              style={{
                width: `${limit > 0 ? Math.min(100, (used / limit) * 100) : 100}%`,
              }}
            />
          </div>
          <div className="text-muted-foreground flex flex-row items-center gap-1.5 font-mono text-[11px] leading-[1.4] tracking-[0.4px]">
            <RotateCcwIcon className="size-3" />
            Resets on {formatResetDate(resetAt)}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-primary-text font-mono text-[12px] leading-[1.4] font-normal tracking-[1.1px] uppercase hover:bg-transparent"
            >
              Maybe later
            </Button>
          </DialogClose>
          <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handleUpgrade}
          >
            Upgrade to {PAID_PLAN.name} <MoveRightIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
