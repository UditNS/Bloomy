import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../utils/constant'
import { addFeed, removeFeed } from '../../utils/feedSlice'
import UserCard from './UserCard'

function Feed() {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const getFeed = async () => {
    if (feed) return
    try {
      const res = await axios.get(BASE_URL + '/feed', {}, { withCredentials: true })
      dispatch(addFeed(res?.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

  const handleSwipe = async (direction, user) => {
    console.log(`Swiped ${direction} on user:`, user)
    
    // Remove user from feed
    dispatch(removeFeed(user._id))
    
    // Send API request based on swipe direction
    try {
      if (direction === 'right') {
        await axios.post(BASE_URL + '/connection/send/likes/' + user._id, {}, { withCredentials: true })
        console.log('Liked user:', user.firstName)
      } else {
        await axios.post(BASE_URL + '/connection/send/pass/' + user._id, {}, { withCredentials: true })
        console.log('Passed user:', user.firstName)
      }
    } catch (error) {
      console.log('Error:', error.message)
    }
  }

  return feed && feed.length > 0 ? (
    <div className="relative overflow-x-hidden min-h-screen flex items-center justify-center">
      {/* Stack of cards - showing up to 3 cards */}
      <div className="relative w-full">
        {feed.slice(0, 3).map((user, index) => (
          <div
            key={user._id}
            className="absolute inset-0 transition-all duration-300"
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              opacity: 1 - index * 0.2,
              pointerEvents: index === 0 ? 'auto' : 'none'
            }}
          >
            {index === 0 && <UserCard user={user} onSwipe={handleSwipe} />}
            {index !== 0 && (
              // Static preview cards (not interactive)
              <div className="flex flex-col items-center justify-center w-full px-4 py-20 sm:py-24 md:py-28">
                <div className="w-full max-w-[90vw] sm:max-w-[450px] md:max-w-[500px] aspect-[5/6] rounded-xl sm:rounded-2xl overflow-hidden relative border-2 shadow-2xl">
                  <img
                    className="w-full h-full object-cover"
                    src={user.photo}
                    alt={user.firstName}
                  />
                  <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 right-3 text-white">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold drop-shadow-lg truncate">
                      {user.firstName}
                    </h2>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen overflow-x-hidden">
      <p className="text-2xl text-gray-500">No more users to show</p>
    </div>
  )
}

export default Feed