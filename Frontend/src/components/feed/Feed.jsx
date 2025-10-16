import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Heart, X, Info, Loader2, UserX, Handshake } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../../utils/constant'
import UserCard from './UserCard'
import { addFeed, removeFeed } from '../../utils/feedSlice'

function Feed() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef(null)
  const emptyStateRef = useRef(null)
  const [isdisabled, setIsDisabled] = useState(false)
  const currentUser = useSelector((store) => store.user)

  // 1. New function to handle API fetch with pagination (replaces the incorrect inner `fetchFeed`)
  const fetchFeedApi = useCallback(async (pageNumber, limit = 10) => {
    try {
      // Use the pageNumber and limit in the API call
      const res = await axios.get(BASE_URL + `/user/feed?page=${pageNumber}&limit=${limit}`, {
        withCredentials: true
      })

      let fetchedUsers = res?.data?.data || res?.data || []

      // Filter out current user's own profile
      if (currentUser?._id) {
        const originalLength = fetchedUsers.length
        fetchedUsers = fetchedUsers.filter(user => user._id !== currentUser._id)
        if (originalLength !== fetchedUsers.length) {
          console.log(`Filtered ${originalLength - fetchedUsers.length} self-profile(s) from feed`)
        }
      }
      if (currentUser?.email) {
        fetchedUsers = fetchedUsers.filter(user => user.email !== currentUser.email)
      }

      return fetchedUsers
    } catch (error) {
      console.error('Feed fetch error:', error)
      return []
    }
  }, [currentUser]) // Depend on currentUser for filtering

  // 2. Refactored initial load function to use the new `fetchFeedApi`
  const loadInitialFeed = useCallback(async () => {
    setIsLoading(true);
    const limit = 10;
    try {
      const data = await fetchFeedApi(1, limit);

      if (Array.isArray(data)) {
        setUsers(data);
        setHasMore(data.length === limit);
      } else {
        console.error("Unexpected feed data:", data);
        setUsers([]);
        setHasMore(false);
      }

      setPage(1);
    } catch (error) {
      console.error("Failed to load feed:", error);
      setUsers([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFeedApi]);

  // Initial load effect
  useEffect(() => {
    loadInitialFeed()
  }, [loadInitialFeed])

  // 3. Function to load subsequent pages
  const loadMoreUsers = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    const limit = 10;
    try {
      const nextPage = page + 1
      const data = await fetchFeedApi(nextPage, limit)

      if (data.length > 0) {
        setUsers(prev => [...prev, ...data])
        setPage(nextPage)
        setHasMore(data.length === limit)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more users:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, page, fetchFeedApi])

  // 4. Added missing function for connection request
  const sendConnectionRequest = async (status, targetUserId) => {
    setIsDisabled(true)
    const endpoint = status === 'likes' ? '/connection/send/likes/' : '/connection/send/pass/'
    try {
      await axios.post(
        BASE_URL + endpoint + targetUserId,
        {},
        {
          withCredentials: true
        }
      )
    } catch (error) {
      // Log and potentially handle error (e.g., if match failed, etc.)
      console.error(`Error sending ${status} request:`, error)
      throw error // Re-throw to be caught in handleSwipe
    }
    finally{
      setIsDisabled(false)
    }
  }


  // Loader rotation animation
  useEffect(() => {
    if (isLoading && loaderRef.current) {
      gsap.to(loaderRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'linear'
      })
    }
  }, [isLoading])

  // Empty state animation
  useEffect(() => {
    if (!isLoading && users.length === 0 && emptyStateRef.current) {
      gsap.fromTo(
        emptyStateRef.current,
        {
          scale: 0.5,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }
      )
    }
  }, [isLoading, users])

  const handleSwipe = useCallback(async (direction, user) => {
    const status = direction === 'right' ? 'likes' : 'pass'

    // Remove user from feed immediately
    setUsers(prev => {
      const newUsers = prev.filter(u => u._id !== user._id)

      // Load more users if running low (less than 3 remaining)
      if (newUsers.length < 3 && hasMore && !isLoadingMore) {
        // Debounce or ensure this doesn't trigger multiple times in quick succession
        // For simplicity, calling it directly here.
        loadMoreUsers()
      }

      return newUsers
    })

    // Send API request
    try {
      await sendConnectionRequest(status, user._id)
      console.log(`✓ ${status} sent successfully for ${user.firstName}`)
    } catch (error) {
      console.error('Failed to send connection request:', error)
      // Note: In a real app, you might want to re-add the card or show an error state
    }

  }, [hasMore, isLoadingMore, loadMoreUsers]) // Added loadMoreUsers to dependency array

  if (isLoading && users.length === 0) { // Only show full-screen loader on initial load
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div
            ref={loaderRef}
            className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
          />
          <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground font-medium">
            Finding amazing people...
          </p>
        </div>
      </div>
    )
  }

  if (users.length === 0 && !isLoading) { // Show empty state only when not loading
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div ref={emptyStateRef} className="text-center max-w-md">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center shadow-xl">
            <UserX className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-bold mb-3 md:mb-4">
            No More Profiles
          </h3>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
            You've seen all available profiles. Check back soon for new connections!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background pt-20 pb-32 px-4">
      <div className="relative w-full max-w-lg mx-auto" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
        {/* Stacked Cards */}
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user._id}
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{
              zIndex: 30 - index,
              transform: `scale(${1 - index * 0.04}) translateY(${index * 8}px)`,
              opacity: 1 - index * 0.12,
              filter: index > 0 ? 'blur(0.5px)' : 'none',
            }}
          >
            <UserCard
              user={user}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons - Fixed at bottom, outside card stack */}
      {users.length > 0 && (
        <div className=" flex items-center justify-center w-full mt-10 gap-6 z-50">
          <button
          disabled={isdisabled}
            onClick={() => {
              const topCard = users[0]
              if (topCard) {
                const button = document.querySelector('.btn-pass')
                if (button) {
                  gsap.to(button, {
                    scale: 0.85,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                  })
                }
                // Execute swipe after the button animation starts
                setTimeout(() => {
                  handleSwipe('left', topCard)
                }, 80)
              }
            }}
            className="btn-pass w-16 h-16 md:w-20 md:h-20 rounded-full bg-white dark:bg-gray-800 border-4 border-red-400 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 shadow-2xl group transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Pass"
          >
            <X className="w-8 h-8 md:w-10 md:h-10 text-red-300 group-hover:scale-110 transition-transform" />
          </button>

          <button
          disabled={isdisabled}
            onClick={() => {
              const topCard = users[0]
              if (topCard) {
                const button = document.querySelector('.btn-like')
                if (button) {
                  gsap.to(button, {
                    scale: 0.85,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                  })
                }
                // Execute swipe after the button animation starts
                setTimeout(() => {
                  handleSwipe('right', topCard)
                }, 80)
              }
            }}
            className="btn-like w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-500 shadow-2xl flex items-center justify-center hover:from-pink-600 hover:via-fuchsia-700 hover:to-purple-600 group transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Like"
          >
            <Handshake className="w-8 h-8 md:w-10 md:h-10 text-white f group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-sm text-foreground font-medium">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feed