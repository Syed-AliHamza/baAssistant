import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CodeBlockSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto  rounded-lg">
      <div className="mb-2">
        <Skeleton className="h-6 w-24 bg-gray-200" />
      </div>
      <div className="bg-gray-900 rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-full bg-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-2/3 bg-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-1/3 bg-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-1/4 bg-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default CodeBlockSkeleton
