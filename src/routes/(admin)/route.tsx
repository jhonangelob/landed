import { Outlet, createFileRoute } from '@tanstack/react-router'

import AdminHeader from '#/components/admin/AdminHeader'

export const Route = createFileRoute('/(admin)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="bg-background min-h-screen border">
      <AdminHeader />
      <main className="mx-auto mt-16 w-full max-w-370 px-4 pt-4 pb-12 md:px-7 md:pt-7 md:pb-20">
        <Outlet />
      </main>
    </div>
  )
}
