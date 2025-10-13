import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full pt-20 pb-8 px-4">
      <div className="w-full relative max-w-4xl rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Skeleton */}
        <div className="relative h-32">
          <Skeleton className="w-full h-32 rounded-none" />
          <div className="absolute -bottom-16 left-8">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="flex justify-end gap-3 pt-6 px-8 bg-card">
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Form Section Skeleton */}
        <div className="p-8 pt-16 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* First Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Skills */}
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton