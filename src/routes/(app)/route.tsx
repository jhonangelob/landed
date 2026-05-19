import Footer from '#/components/layout/Footer'
import Header from '#/components/layout/Header'
import { getSession } from '#/lib/auth/session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
      <main className="max-w-7xl mx-auto p-4 md:p-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
