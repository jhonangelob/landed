import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'

import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'

import AppHeader from '#/components/layout/AppHeader'
import Footer from '#/components/layout/Footer'
import MarketingHeader from '#/components/layout/MarketingHeader'
import { NavigationProgress } from '#/components/layout/NavigationProgress'
import NotFound from '#/components/layout/NotFound'

import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Landed',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

/** Routes that render their own full-screen layout (no Header/Footer). */
const AUTH_ROUTES = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/email-verified',
])

function RootDocument({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  const isAuthRoute =
    AUTH_ROUTES.has(pathname) || pathname.startsWith('/share/')

  const isAppRoute = pathname.includes('/app')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NavigationProgress />
        <TooltipProvider>
          {isAuthRoute ? (
            children
          ) : (
            <>
              {!isAppRoute ? <MarketingHeader /> : <AppHeader />}
              <main className="bg-surface-muted mt-14 flex min-h-[calc(100vh-115px)] md:min-h-[calc(100vh-56px)]">
                {children}
              </main>
              {!isAppRoute && <Footer />}
            </>
          )}
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          closeButton
          expand={true}
          visibleToasts={5}
        />

        <Scripts />
      </body>
    </html>
  )
}
