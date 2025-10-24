import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

const ChatSkeleton = () => {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Chat Header Skeleton - Fixed */}
      <div className="flex-none flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b mt-12 sm:mt-16 bg-card shadow-sm z-10">
        <button className="p-2 rounded-full">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Profile Avatar Skeleton */}
        <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />

        {/* User Info Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-32 sm:w-40" />
        </div>
      </div>

      {/* Messages Container Skeleton - Scrollable */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 sm:space-y-4"
        style={{
          maxHeight: 'calc(100vh - 180px)',
          minHeight: 0
        }}
      >
        {/* Message Bubbles Skeleton */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md space-y-2 flex flex-col ${
                index % 2 === 0 ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message bubble with shimmer effect */}
              <Skeleton
                className={`h-16 rounded-2xl ${
                  index % 3 === 0
                    ? 'w-48 sm:w-60'
                    : index % 3 === 1
                    ? 'w-40 sm:w-52'
                    : 'w-56 sm:w-72'
                }`}
              />
              {/* Time skeleton */}
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Skeleton - Fixed */}
      <div className="flex-none px-4 sm:px-6 py-3 sm:py-4 border-t bg-card">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
          <Skeleton className="w-9 h-9 rounded-full hidden sm:block flex-shrink-0" />
          <Skeleton className="flex-1 h-10 sm:h-11 rounded-full" />
          <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0" />
        </div>
      </div>

      {/* Add shimmer animation styles */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatSkeleton;