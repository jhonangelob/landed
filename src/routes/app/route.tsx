import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ModalRegistry } from '#/components/ModalRegistry'

import { getSession } from '#/server/session'

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

  return (
    <div className="mx-auto flex w-full max-w-370 pt-7 pb-24">
      <Outlet />
      <ModalRegistry userName={user.name} />
    </div>
  )
}
