import { Card, CardContent } from "@/components/ui/card"

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />
}

export function KpisSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-6">
            <SkeletonPulse className="h-14 w-14 shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonPulse className="h-6 w-1/2" />
              <SkeletonPulse className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AiUsageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <SkeletonPulse className="h-14 w-14 shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonPulse className="h-6 w-2/3" />
            <SkeletonPulse className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function EventsSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <SkeletonPulse className="h-9 w-9" />
            <SkeletonPulse className="h-6 w-2/3" />
            <SkeletonPulse className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ChartsGridSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="w-full">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <SkeletonPulse className="h-5 w-1/3" />
              <SkeletonPulse className="h-4 w-1/2" />
            </div>
            <SkeletonPulse className="h-[280px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
