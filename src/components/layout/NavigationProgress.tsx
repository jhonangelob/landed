import { useEffect, useRef, useState } from 'react'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'

export function NavigationProgress() {
  const initialLoadDone = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  const isRouterLoading = useRouterState({
    select: (s) => s.status === 'pending',
  })

  const isQuerying = useIsFetching() > 0

  const isMutating = useIsMutating() > 0

  const shouldBlockUI = mounted && (isRouterLoading || isMutating)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!initialLoadDone.current) {
      if (!isRouterLoading) initialLoadDone.current = true
      return
    }
    setShow(isRouterLoading || isQuerying)
  }, [isRouterLoading, isQuerying])

  return (
    <>
      {shouldBlockUI && <div className="fixed inset-0 z-9998 cursor-pointer" />}

      <div
        className={`pointer-events-none fixed top-0 right-0 left-0 z-9999 h-0.75 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'} `}
      >
        <div
          className="bg-primary h-full w-full shadow"
          style={{
            animation: show
              ? 'landed-progress 1.8s ease-in-out infinite'
              : 'none',
          }}
        />
      </div>
      <style>{`
        @keyframes landed-progress {
          0%   { transform-origin: left; transform: scaleX(0.02); }
          40%  { transform-origin: left; transform: scaleX(0.5);  }
          70%  { transform-origin: left; transform: scaleX(0.75); }
          100% { transform-origin: left; transform: scaleX(0.92); }
        }
      `}</style>
    </>
  )
}
