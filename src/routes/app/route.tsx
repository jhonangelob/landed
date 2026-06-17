import { useEffect } from 'react'

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ModalRegistry } from '#/components/ModalRegistry'
import MobileDock from '#/components/layout/MobileDock'
import { OnboardingTour } from '#/components/onboarding/OnboardingTour'

import { getSession } from '#/server/session'

import { useOnboardingStore } from '#/lib/store/onboarding'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return { user: session.user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()
  const openOnboarding = useOnboardingStore((s) => s.open)

  useEffect(() => {
    if (!user.hasOnboarded) openOnboarding()
  }, [user.hasOnboarded, openOnboarding])

  return (
    <div className="mx-auto flex w-full max-w-370 pt-3 pb-18 md:pt-7 md:pb-24">
      <Outlet />
      <ModalRegistry userName={user.name} />
      <OnboardingTour userName={user.name} />
      <MobileDock />
    </div>
  )
}
