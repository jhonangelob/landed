import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ModalRegistry } from '#/components/ModalRegistry'
import AdminHeader from '#/components/admin/AdminHeader'
import Header from '#/components/layout/Header'

import { getSession } from '#/server/session'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    if (
      session.user.role === 'admin' &&
      !location.pathname.startsWith('/admin')
    ) {
      throw redirect({ to: '/admin' })
    }

    return { user: session.user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()

  return (
    <div className="bg-background min-h-screen border">
      {user.role === 'admin' ? <AdminHeader /> : <Header />}
      <main className="mx-auto mt-16 w-full max-w-370 px-4 pt-4 pb-12 md:px-7 md:pt-7 md:pb-20">
        <Outlet />
      </main>
      <ModalRegistry userName={user.name} />
    </div>
  )
}
