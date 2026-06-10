import { Outlet, createFileRoute } from '@tanstack/react-router'

import MarketingFooter from '#/components/marketing/MarketingFooter'
import MarketingHeader from '#/components/marketing/MarketingHeader'

export const Route = createFileRoute('/(marketing)')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="bg-background min-h-screen border">
      <MarketingHeader />
      <main className="mt-16 w-full">
        <Outlet />
        <MarketingFooter />
      </main>
    </div>
  )
}
