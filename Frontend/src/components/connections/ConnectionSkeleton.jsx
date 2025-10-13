import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function ConnectionSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4">
        {/* Profile Image Skeleton */}
        <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0" />
        
        {/* Content Skeleton */}
        <div className="flex-1 space-y-3 w-full">
          {/* Name */}
        <Skeleton className="h-6 w-3/4" />
          
          {/* Age */}
        <Skeleton className="h-4 w-1/4" />
          
          {/* Description */}
        <Skeleton className="h-4 w-full" />
          
          {/* Skills */}
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-24" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </div>
    </div>
  )
}

export default ConnectionSkeleton