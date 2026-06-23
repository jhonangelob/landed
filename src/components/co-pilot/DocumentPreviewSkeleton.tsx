import { Skeleton } from '../ui/skeleton'

export default function DocumentPreviewSkeleton() {
  return (
    <div className="space-y-6 px-4 py-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-5/6" />
          <Skeleton className="h-2.5 w-4/6" />
        </div>
      ))}
    </div>
  )
}
