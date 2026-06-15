import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Toaster } from '#/components/ui/sonner'

import Footer from '#/components/layout/Footer'
import Header from '#/components/layout/Header'
import { NavigationProgress } from '#/components/layout/NavigationProgress'
import NotFound from '#/components/layout/NotFound'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
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

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NavigationProgress />
        {isAuthRoute ? (
          children
        ) : (
          <>
            <Header />
            <main className="mx-4 mt-14 flex min-h-[calc(100vh-56px)]">
              {children}
            </main>
            <Footer />
          </>
        )}
        <Toaster
          position="bottom-right"
          closeButton
          expand={true}
          visibleToasts={5}
        />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
