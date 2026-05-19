import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export function NavigationProgress() {
  const initialLoadDone = useRef(false)
  const [show, setShow] = useState(false)

  const isRouterLoading = useRouterState({
    select: (s) => s.status === 'pending',
  })

  const isMutating = useIsMutating() > 0
  const isQuerying = useIsFetching() > 0

  useEffect(() => {
    if (!initialLoadDone.current) {
      if (!isRouterLoading) initialLoadDone.current = true
      return
    }
    setShow(isRouterLoading || isMutating || isQuerying)
  }, [isRouterLoading, isMutating, isQuerying])

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 right-0 z-9999 h-0.5
          pointer-events-none
          transition-opacity duration-300
          ${show ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div
          className="h-full w-full bg-sky-500"
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
