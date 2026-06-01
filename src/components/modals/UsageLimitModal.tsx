import { useState } from 'react'

import { formatResetDate } from '#/helper/usage'
import { CheckIcon, MoveRightIcon, RotateCcwIcon } from 'lucide-react'

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
import { cn } from '#/lib/utils'

import type { PlanId } from '#/validators/subscription'

import { PAID_PLAN, PAID_PLAN_3MO, getPlanById } from '#/constants/plan'

interface UsageLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: UsageLimitReason
  planId: PlanId
  used: number
  limit: number
  resetAt: Date | string | null
}

const PAID_PLANS = [PAID_PLAN, PAID_PLAN_3MO]

export default function UsageLimitModal({
  open,
  onOpenChange,
  planId,
  used,
  limit,
  resetAt,
}: UsageLimitModalProps) {
  const { open: openModal } = useModal()

  const [selected, setSelected] = useState(PAID_PLANS[0])

  const currentPlan = getPlanById(planId)

  const handleUpgrade = () => {
    openModal('updateSubscription', {
      currentPlan,
      newPlan: selected,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center">
          <DialogTitle className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.5px] uppercase">
            Monthly Limit · {currentPlan.name}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="font-display text-primary-text text-[24px] leading-[1.2] font-bold tracking-[-0.6px]">
          You're out of Co-Pilot generations
        </DialogDescription>

        <p className="font-sans text-[14px] leading-[1.55] text-[#2c3a52]">
          You tried to generate a document, but your Economy plan includes{' '}
          <span className="font-bold">10 Co-Pilot generations</span> per month.
          Your allowance refills in 14 days — or upgrade now to keep going.
        </p>

        <div className="flex flex-col gap-3 rounded-lg border bg-[#f5f6f8] px-3.75 py-3.25">
          <div className="flex flex-row items-center justify-between">
            <p className="text-muted font-mono text-[11px] leading-[1.55] tracking-[1.3px] uppercase">
              Usage this month
            </p>
            <p className="text-primary-text font-mono text-[12px] leading-[1.55] font-semibold tracking-[0.5px]">
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
          <div className="text-muted flex flex-row items-center gap-1.5 font-mono text-[10px] leading-[1.55] tracking-[1px] uppercase">
            <RotateCcwIcon className="size-2.5" />
            Resets on {formatResetDate(resetAt)}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted font-mono text-[11px] leading-[1.55] font-medium tracking-[1.3px] uppercase">
            Keep Going
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PAID_PLANS.map((item, index) => (
              <div
                className={cn(
                  'cursor-pointer space-y-2 rounded-lg border bg-[#f5f6f8] p-4',
                  selected.id === item.id && 'border-primary',
                )}
                onClick={() => setSelected(PAID_PLANS[index])}
                key={item.name}
              >
                <div className="flex h-[19.5px] flex-row items-center justify-between">
                  <p className="text-muted font-mono text-[11px] leading-[1.55] font-normal tracking-[1.5px] uppercase">
                    {item.id}
                  </p>
                  {selected.id === item.id && (
                    <p className="bg-primary rounded-full px-1.75 py-0.5 font-mono text-[10px] leading-[1.55] font-normal tracking-[1.2px] text-white uppercase">
                      Pick
                    </p>
                  )}
                </div>

                <p className="text-muted font-sans text-[13px] leading-none font-normal tracking-[-0.7px]">
                  <span className="text-primary-text text-[28px] font-bold">
                    P{item.price}
                  </span>{' '}
                  per month
                </p>
                <div>
                  {item.features.map((t) => (
                    <p
                      className="text-primary-text flex flex-row items-center gap-1 font-sans text-[13px] leading-[1.55] font-normal"
                      key={t}
                    >
                      <CheckIcon className="text-primary size-3 stroke-3" /> {t}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-primary-text font-mono text-[12px] leading-[1.4] font-normal tracking-[0.9px] uppercase hover:bg-transparent"
            >
              Wait For Refill
            </Button>
          </DialogClose>
          <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handleUpgrade}
          >
            Upgrade <MoveRightIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
