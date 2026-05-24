import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import Footer from '#/components/layout/Footer'
import Header from '#/components/layout/Header'

import { getSession } from '#/lib/auth/session'

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
    <div className="bg-background min-h-screen">
      <Header />
      <main className="mx-auto mt-16 w-full max-w-370 px-7 pt-7 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
