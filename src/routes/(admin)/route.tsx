import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="mx-auto flex w-full max-w-370 pt-7 pb-24">
      <Outlet />
    </div>
  )
}
