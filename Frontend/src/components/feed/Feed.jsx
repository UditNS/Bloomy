import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import gsap from 'gsap'
import { BASE_URL } from '../../utils/constant'
import { addFeed, removeFeed } from '../../utils/feedSlice'
import UserCard from './UserCard'

function Feed() {
  const feed = useSelector((store) => store.feed)
  const currentUser = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const loaderRef = useRef(null)
  const emptyStateRef = useRef(null)

  const getFeed = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(BASE_URL + '/user/feed', { 
        withCredentials: true 
      })
      
      let users = res?.data?.data || res?.data || []
      
      if (currentUser?._id) {
        const originalLength = users.length
        users = users.filter(user => user._id !== currentUser._id)
        console.log(`Filtered ${originalLength - users.length} self-profile(s) from feed`)
      }
      
      if (currentUser?.email) {
        users = users.filter(user => user.email !== currentUser.email)
      }
      dispatch(addFeed(users))
    } catch (error) {
      console.error('Feed fetch error:', error)
      dispatch(addFeed([]))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

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

  useEffect(() => {
    if (!isLoading && feed?.length === 0 && emptyStateRef.current) {
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
  }, [isLoading, feed])

  const handleSwipe = async (direction, user) => {

    dispatch(removeFeed(user._id))
    
    try {
      const status = direction === 'right' ? 'likes' : 'pass'
      const response = await axios.post(
        `${BASE_URL}/connection/send/${status}/${user._id}`, 
        {}, 
        { withCredentials: true }
      )
      console.log(`✓ ${status} sent successfully:`, response.data)
    } catch (error) {
      console.error('Connection error:', error.response?.data || error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div 
            ref={loaderRef}
            className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full mx-auto"
          />
          <p className="mt-6 text-xl text-muted-foreground font-semibold animate-pulse">
            Finding amazing people...
          </p>
        </div>
      </div>
    )
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div ref={emptyStateRef} className="text-center px-6">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-4xl text-foreground font-bold mb-4">
            That's Everyone!
          </h3>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            You've seen all available profiles. Check back soon for new connections!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background py-8 px-4">
      <div className="relative w-full max-w-7xl flex items-center justify-center">
        {feed.slice(0, 3).map((user, index) => (
          <div
            key={user._id}
            className="absolute transition-all duration-300 ease-out"
            style={{
              zIndex: feed.length - index,
              pointerEvents: index === 0 ? 'auto' : 'none',
              transform: `scale(${1 - index * 0.05}) translateY(${index * 16}px)`,
              opacity: 1 - index * 0.2,
              filter: index > 0 ? 'blur(2px)' : 'none'
            }}
          >
            {index === 0 ? (
              <UserCard user={user} onSwipe={handleSwipe} />
            ) : (
              <PreviewCard user={user} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Preview card for background cards
function PreviewCard({ user }) {
  return (
    <div className="w-full max-w-[550px] aspect-[5/7] rounded-3xl overflow-hidden relative shadow-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-700">
      <img
        className="w-full h-full object-cover"
        src={user.photo}
        alt={user.firstName}
        onError={(e) => {
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2U3ZTk7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTNlOWVmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
        <div className="flex items-end gap-3">
          <h2 className="text-3xl font-bold text-white drop-shadow-2xl truncate">
            {user.firstName}
          </h2>
          <p className="text-2xl font-semibold text-white/95 drop-shadow-2xl">
            {user.age}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Feed