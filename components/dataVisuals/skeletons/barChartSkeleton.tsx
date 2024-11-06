import { Skeleton } from '@/components/ui/skeleton'

export function BarChartSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-2/3 bg-gray-200" />
      <div className="flex flex-col h-[300px] justify-between">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-end h-full">
            <div className="w-[50px] bg-gray-200 h-4/5 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-gray-200 h-3/5 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-gray-200 h-[9/10] rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-gray-200 h-7/10 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-gray-200 h-1/2 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-gray-200 h-3/4 rounded-t-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
