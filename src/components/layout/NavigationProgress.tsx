import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export function NavigationProgress() {
  const initialLoadDone = useRef(false)
  const [show, setShow] = useState(false)

  const isLoading = useRouterState({
    select: (s) => s.status === 'pending',
  })

  useEffect(() => {
    if (!initialLoadDone.current) {
      if (!isLoading) initialLoadDone.current = true
      return
    }
    setShow(isLoading)
  }, [isLoading])

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
