import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { useCompleteOnboardingMutation } from '#/hooks/useAccountQueries'

import { Button } from '#/components/ui/button'

import { useOnboardingStore } from '#/lib/store/onboarding'
import { cn } from '#/lib/utils'

interface TourStep {
  target?: string
  kicker: string
  title: string
  body: string
}

function buildSteps(userName: string): TourStep[] {
  const firstName = userName.trim().split(' ')[0] || 'Pilot'

  return [
    {
      kicker: 'Pre-flight check',
      title: `Welcome aboard, ${firstName}.`,
      body: "Here's a quick tour of the cockpit. Use the arrow keys to move between stops, and Esc to skip at any time.",
    },
    {
      target: 'flight-deck',
      kicker: 'Step 1 of 5',
      title: 'Flight Deck',
      body: 'Your command center — every application tracked by stage on a single board.',
    },
    {
      target: 'co-pilot',
      kicker: 'Step 2 of 5',
      title: 'Co-Pilot',
      body: 'Paste a job post and Co-Pilot tailors a CV and cover letter in seconds.',
    },
    {
      target: 'profile',
      kicker: 'Step 3 of 5',
      title: 'Pilot Profile',
      body: 'Your master CV. Set this up first — Co-Pilot uses it for everything it writes.',
    },
    {
      target: 'hangar',
      kicker: 'Step 4 of 5',
      title: 'The Hangar',
      body: 'Account settings, billing, and your subscription all live in here.',
    },
    {
      target: 'new-application',
      kicker: 'Step 5 of 5',
      title: 'New Application',
      body: 'Spotted a role? Start here to add it and tailor your documents.',
    },
  ]
}

const TOOLTIP_WIDTH = 340
const EDGE = 12
const GAP = 14

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function OnboardingTour({ userName }: { userName: string }) {
  const steps = useMemo(() => buildSteps(userName), [userName])

  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const isOpen = useOnboardingStore((s) => s.isOpen)
  const close = useOnboardingStore((s) => s.close)

  const { mutate: completeOnboarding } = useCompleteOnboardingMutation()

  const step = steps[index]
  const isLast = index === steps.length - 1

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isOpen) setIndex(0)
  }, [isOpen])

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !isOpen) return

    if (!step.target) {
      setRect(null)
      return
    }

    const measure = () => {
      const el = document.querySelector<HTMLElement>(
        `[data-tour="${step.target}"]`,
      )
      if (!el) {
        setRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      setRect(r.width === 0 && r.height === 0 ? null : r)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [mounted, isOpen, step.target])

  const finish = useCallback(() => {
    close()
    completeOnboarding()
  }, [close, completeOnboarding])

  const next = useCallback(
    () => setIndex((i) => Math.min(steps.length - 1, i + 1)),
    [steps.length],
  )
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    if (!mounted || !isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        finish()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        if (isLast) finish()
        else next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, isOpen, isLast, finish, next, prev])

  if (!mounted || !isOpen) return null

  const vw = window.innerWidth
  const centered = !rect

  let tooltipLeft = (vw - TOOLTIP_WIDTH) / 2
  let tooltipTop = 0
  let arrowLeft = TOOLTIP_WIDTH / 2

  if (rect) {
    const targetCenter = rect.left + rect.width / 2
    tooltipLeft = Math.min(
      Math.max(targetCenter - TOOLTIP_WIDTH / 2, EDGE),
      vw - TOOLTIP_WIDTH - EDGE,
    )
    tooltipTop = rect.bottom + GAP
    arrowLeft = Math.min(
      Math.max(targetCenter - tooltipLeft, 20),
      TOOLTIP_WIDTH - 20,
    )
  }

  return (
    <div
      className="fixed inset-0 z-100"
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
    >
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-lg transition-all duration-200"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: '0 0 0 9999px rgba(8, 15, 26, 0.6)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[rgba(8,15,26,0.6)]" />
      )}

      <div
        className={cn(
          'absolute',
          centered && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        )}
        style={
          centered
            ? { width: TOOLTIP_WIDTH }
            : { top: tooltipTop, left: tooltipLeft, width: TOOLTIP_WIDTH }
        }
      >
        {!centered && (
          <div
            className="border-border absolute -top-1.5 size-3 border-t border-l bg-white"
            style={{
              left: arrowLeft,
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />
        )}

        <div className="relative space-y-3 rounded-lg border bg-white p-5 shadow-xl">
          <p className="text-primary font-mono text-[11px] leading-[1.4] font-semibold tracking-[1.4px] uppercase">
            {step.kicker}
          </p>

          <div className="space-y-1.5">
            <p className="font-display text-primary-text text-[20px] leading-[1.2] font-bold tracking-[-0.5px]">
              {step.title}
            </p>
            <p className="text-ink-muted font-sans text-[14px] leading-[1.55]">
              {step.body}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to step ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5',
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {index === 0 && (
                <button
                  type="button"
                  onClick={finish}
                  className="text-muted hover:text-ink-muted mx-auto mr-4 block font-mono text-[11px] tracking-[0.6px] uppercase"
                >
                  Skip tour
                </button>
              )}
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prev}
                  className="font-mono text-[11px] tracking-[0.6px] uppercase"
                >
                  Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={isLast ? finish : next}
                className="font-mono text-[11px] tracking-[0.6px] uppercase"
              >
                {index === 0 ? 'Start tour' : isLast ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
