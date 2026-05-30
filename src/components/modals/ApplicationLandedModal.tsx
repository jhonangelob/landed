import { PartyPopperIcon, PlaneLandingIcon } from 'lucide-react'

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

interface ApplicationLandedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: string
  role: string
}

export default function ApplicationLandedModal({
  open,
  onOpenChange,
  company,
  role,
}: ApplicationLandedModalProps) {
  const navigate = useNavigate()

  const handleViewFlightDeck = () => {
    onOpenChange(false)
    navigate({ to: '/flight-deck' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center">
          <PlaneLandingIcon className="text-primary size-2.5" />
          <DialogTitle className="text-primary font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.1px] uppercase">
            Touchdown
          </DialogTitle>
          <span className="text-muted-foreground font-mono text-[11px] leading-[1.4] tracking-normal uppercase">
            · Cleared to land
          </span>
        </DialogHeader>

        <div className="bg-primary/10 text-primary mx-auto flex size-16 items-center justify-center rounded-full">
          <PartyPopperIcon className="size-7" />
        </div>

        <DialogDescription className="font-display text-primary-text text-center text-[32px] leading-[1.06] font-bold tracking-[-0.8px]">
          You <span className="text-primary italic">landed</span> it!
        </DialogDescription>

        <p className="text-muted-foreground text-center font-sans text-[14px] leading-[1.5]">
          Congratulations on the offer
          {role ? (
            <>
              {' '}
              for{' '}
              <span className="text-primary-text font-semibold">{role}</span>
            </>
          ) : null}
          {company ? (
            <>
              {' '}
              at{' '}
              <span className="text-primary-text font-semibold">{company}</span>
            </>
          ) : null}
          . Every application led to this runway. Enjoy the moment. ✈️
        </p>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="ghost"
            className="text-primary-text font-mono text-[12px] leading-[1.4] font-normal tracking-[1.1px] uppercase hover:bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Keep celebrating
          </Button>
          <Button
            className="font-mono text-[12px] leading-[1.4] font-semibold tracking-[0.7px] uppercase"
            onClick={handleViewFlightDeck}
          >
            <PlaneLandingIcon /> View Flight Deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
