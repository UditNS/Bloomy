import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const UserCardSkeleton = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl bg-card border border-border/50">
        {/* Image Skeleton */}
        <Skeleton className="w-full h-full absolute inset-0 bg-muted animate-pulse" />

        {/* Info Button Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-12 h-12 rounded-full bg-muted-foreground/20 animate-pulse" />
        </div>

        {/* User Info Gradient Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Name and Age Skeleton */}
          <div className="flex items-end gap-3 mb-3">
            <Skeleton className="h-10 w-32 bg-white/20 animate-pulse" />
            <Skeleton className="h-9 w-12 bg-white/20 animate-pulse" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-4 w-full bg-white/20 animate-pulse" />
            <Skeleton className="h-4 w-3/4 bg-white/20 animate-pulse" />
          </div>

          {/* Skills Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full bg-white/20 animate-pulse" />
            <Skeleton className="h-8 w-24 rounded-full bg-white/20 animate-pulse" />
            <Skeleton className="h-8 w-16 rounded-full bg-white/20 animate-pulse" />
            <Skeleton className="h-8 w-28 rounded-full bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;
