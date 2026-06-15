import { CheckCircleIcon } from 'lucide-react'

import { Link, createFileRoute, redirect } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import { getSession } from '#/server/session'

import logo from '/landed.svg'

export const Route = createFileRoute('/(auth)/email-verified')({
  head: () => ({
    meta: [{ title: 'Landed | Email Verified' }],
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (session) throw redirect({ to: '/app' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background flex h-screen flex-col items-center justify-start gap-4 p-12 md:justify-center">
      <img src={logo} alt="Landed" className="mb-4 h-10 min-w-fit md:h-14" />

      <div className="flex w-100 flex-col items-center gap-6 rounded-xl border bg-white px-7 py-8 text-center">
        <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
          <CheckCircleIcon className="text-primary h-7 w-7" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-display text-primary-text text-[24px] font-bold">
            You're cleared for takeoff.
          </p>
          <p className="text-muted-foreground font-sans text-[14px] leading-relaxed">
            Your email has been verified. Sign in to start tracking your job
            search with Landed.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link to="/login" className="text-white!">
            Sign in to Landed
          </Link>
        </Button>
      </div>
    </div>
  )
}
