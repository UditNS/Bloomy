import React, { useState, useRef, useEffect } from 'react'
import { Heart, X, Info } from 'lucide-react'
import gsap from 'gsap'

function UserCard({ user, onSwipe }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  const cardRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          scale: 0.8, 
          opacity: 0,
          y: 50,
          rotateY: -20
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'back.out(1.5)'
        }
      )
    }
  }, [user._id])

  const handleDragStart = (clientX, clientY) => {
    if (isAnimating) return
    setIsDragging(true)
    startPosRef.current = { x: clientX, y: clientY }
  }

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || isAnimating) return
    
    const deltaX = clientX - startPosRef.current.x
    const deltaY = clientY - startPosRef.current.y
    
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleDragEnd = () => {
    if (!isDragging || isAnimating) return
    setIsDragging(false)

    const swipeThreshold = 120
    const { x } = dragOffset

    if (Math.abs(x) > swipeThreshold) {
      const direction = x > 0 ? 'right' : 'left'
      executeSwipe(direction)
    } else {
      gsap.to(cardRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)'
      })
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const executeSwipe = (direction) => {
    setIsAnimating(true)
    const targetX = direction === 'right' ? 1000 : -1000
    const targetRotation = direction === 'right' ? 30 : -30

    gsap.to(cardRef.current, {
      x: targetX,
      y: 100,
      rotation: targetRotation,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        onSwipe?.(direction, user)
        setIsAnimating(false)
        setDragOffset({ x: 0, y: 0 })
      }
    })
  }

  const handleButtonClick = (direction) => {
    if (isAnimating) return
    
    gsap.to(`.btn-${direction}`, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })
    
    executeSwipe(direction)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    handleDragMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  const rotation = dragOffset.x * 0.05
  const likeOpacity = Math.max(0, Math.min(1, dragOffset.x / 150))
  const nopeOpacity = Math.max(0, Math.min(1, -dragOffset.x / 150))

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: '100%', height: '100%' }}>
      {/* Main Card */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '600px',
          height: '700px',
          transform: isDragging 
            ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`
            : undefined,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        className="rounded-3xl overflow-hidden relative shadow-2xl select-none bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-700"
      >
        {/* Image */}
        <img
          className="w-full h-full object-cover"
          src={user.photo}
          alt={user.firstName}
          draggable="false"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWM1ZTU7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmRhNGFmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
          }}
        />

        {/* LIKE Overlay */}
        <div
          style={{ opacity: likeOpacity }}
          className="absolute top-12 right-12 pointer-events-none"
        >
          <div className="border-4 border-green-500 text-green-500 text-6xl font-black px-6 py-3 rounded-2xl rotate-12 shadow-2xl bg-white/20 backdrop-blur-sm">
            LIKE
          </div>
        </div>

        {/* NOPE Overlay */}
        <div
          style={{ opacity: nopeOpacity }}
          className="absolute top-12 left-12 pointer-events-none"
        >
          <div className="border-4 border-red-500 text-red-500 text-6xl font-black px-6 py-3 rounded-2xl -rotate-12 shadow-2xl bg-white/20 backdrop-blur-sm">
            NOPE
          </div>
        </div>

        {/* Info Button */}
        {!showInfo && (
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
          >
            <Info className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
          <div className="flex items-end gap-4 mb-4">
            <h2 className="text-5xl font-bold text-white drop-shadow-2xl truncate">
              {user.firstName}
            </h2>
            <p className="text-4xl font-semibold text-white/95 drop-shadow-2xl flex-shrink-0">
              {user.age}
            </p>
          </div>

          {/* Description */}
          {user.description && (
            <p className="text-base text-white/95 drop-shadow-lg mb-3 line-clamp-2">
              {user.description}
            </p>
          )}

          {/* Skills */}
          {user.skill && user.skill.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.skill.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-white/20 backdrop-blur-md rounded-full text-white font-medium drop-shadow-lg border border-white/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Expanded Info Panel */}
        {showInfo && (
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl p-6 overflow-y-auto pointer-events-auto z-20"
            onClick={() => setShowInfo(false)}
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="mt-12 text-white space-y-4">
              <div>
                <h3 className="text-4xl font-bold mb-2">{user.firstName} {user.lastName}, {user.age}</h3>
                {user.description && (
                  <p className="text-white/90 text-lg">{user.description}</p>
                )}
              </div>

              {user.skill && user.skill.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skill.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-base bg-white/20 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.gender && (
                <div>
                  <h4 className="text-xl font-semibold mb-2">Gender</h4>
                  <p className="text-white/90 text-lg capitalize">{user.gender}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-8 mt-10">
        <button
          onClick={() => handleButtonClick('left')}
          disabled={isAnimating}
          className="btn-left w-20 h-20 rounded-full bg-white dark:bg-gray-800 border-4 border-red-500 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 active:scale-90 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Pass"
        >
          <X className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => handleButtonClick('right')}
          disabled={isAnimating}
          className="btn-right w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 border-4 border-white dark:border-gray-700 flex items-center justify-center hover:from-pink-600 hover:to-red-600 active:scale-90 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Like"
        >
          <Heart className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default UserCard