import React, { useState, useRef } from 'react'
import { Heart, X } from 'lucide-react'

function UserCard({ user, onSwipe }) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const cardRef = useRef(null)

  const handleStart = (clientX) => {
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(0)
  }

  const handleMove = (clientX) => {
    if (!isDragging) return
    const diff = clientX - startX
    setCurrentX(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const swipeThreshold = 100
    
    if (currentX > swipeThreshold) {
      // Swipe right - Like
      handleSwipeAnimation('right')
    } else if (currentX < -swipeThreshold) {
      // Swipe left - Pass
      handleSwipeAnimation('left')
    } else {
      // Return to center
      setCurrentX(0)
    }
  }

  const handleSwipeAnimation = (direction) => {
    setIsSwiping(true)
    const distance = direction === 'right' ? 1000 : -1000
    setCurrentX(distance)
    
    setTimeout(() => {
      onSwipe?.(direction, user)
      setCurrentX(0)
      setIsSwiping(false)
    }, 300)
  }

  const handleButtonClick = (direction) => {
    handleSwipeAnimation(direction)
  }

  // Mouse events
  const handleMouseDown = (e) => handleStart(e.clientX)
  const handleMouseMove = (e) => handleMove(e.clientX)
  const handleMouseUp = () => handleEnd()
  const handleMouseLeave = () => {
    if (isDragging) handleEnd()
  }

  // Touch events
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX)
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX)
  const handleTouchEnd = () => handleEnd()

  const rotation = currentX * 0.05
  const opacity = isSwiping ? 0 : 1 - Math.abs(currentX) / 500

  const likeOpacity = Math.max(0, Math.min(1, currentX / 100))
  const passOpacity = Math.max(0, Math.min(1, -currentX / 100))

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-20 sm:py-24 md:py-28 overflow-x-hidden">
      {/* Card */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${currentX}px) rotate(${rotation}deg)`,
          opacity: opacity,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        className="w-full max-w-[90vw] sm:max-w-[450px] md:max-w-[500px] aspect-[5/6] rounded-xl sm:rounded-2xl overflow-hidden relative border-2 shadow-2xl select-none"
      >
        <img
          className="w-full h-full object-cover"
          src={user.photo}
          alt={user.firstName + "'s Display Picture"}
          draggable="false"
        />
        
        {/* Like Overlay */}
        <div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 right-6 sm:top-10 sm:right-10 border-2 sm:border-4 border-green-500 text-green-500 text-3xl sm:text-5xl md:text-6xl font-bold px-3 py-1 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl rotate-12 pointer-events-none"
        >
          LIKE
        </div>

        {/* Pass Overlay */}
        <div
          style={{ opacity: passOpacity }}
          className="absolute top-6 left-6 sm:top-10 sm:left-10 border-2 sm:border-4 border-red-500 text-red-500 text-3xl sm:text-5xl md:text-6xl font-bold px-3 py-1 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl -rotate-12 pointer-events-none"
        >
          PASS
        </div>

        {/* User Info */}
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 right-3 text-white space-y-2">
          {/* Name and Age */}
          <div className="flex items-end gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold drop-shadow-lg truncate">
              {user.firstName}
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-medium drop-shadow-lg flex-shrink-0">{user.age}</p>
          </div>
          
          {/* Description */}
          {user.description && (
            <p className="text-sm sm:text-base drop-shadow-lg line-clamp-1">
              {user.description}
            </p>
          )}
          
          {/* Skills (Top 4) */}
          {user.skill && user.skill.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {user.skill.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full drop-shadow-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 sm:gap-6 mt-6 sm:mt-8">
        <button
          onClick={() => handleButtonClick('left')}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-red-500 flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all shadow-lg"
          aria-label="Pass"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </button>
        
        <button
          onClick={() => handleButtonClick('right')}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-green-500 flex items-center justify-center hover:bg-green-50 active:scale-95 transition-all shadow-lg"
          aria-label="Like"
        >
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        </button>
      </div>
    </div>
  )
}

export default UserCard