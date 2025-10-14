import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function ConnectionSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border/50">
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 gap-6">
        <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0" />
        
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-7 w-3/4 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-1/4 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>

        <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-28" />
          <Skeleton className="h-10 w-full sm:w-28" />
        </div>
      </div>
    </div>
  )
}


export default ConnectionSkeleton