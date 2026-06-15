import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(marketing)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="bg-background min-h-screen w-screen">
      <Outlet />
    </div>
  )
}
