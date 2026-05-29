import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ModalRegistry } from '#/components/ModalRegistry'
import Footer from '#/components/layout/Footer'
import Header from '#/components/layout/Header'

import { getSession } from '#/server/session'

export const Route = createFileRoute('/(app)')({
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
  return (
    <div className="bg-background min-h-screen border">
      <Header />
      <main className="mx-auto mt-16 w-full max-w-370 px-4 pt-4 pb-12 md:px-7 md:pt-7 md:pb-20">
        <Outlet />
      </main>
      <Footer />
      <ModalRegistry />
    </div>
  )
}
