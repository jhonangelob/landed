import Footer from '#/components/layout/Footer'
import Header from '#/components/layout/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
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
