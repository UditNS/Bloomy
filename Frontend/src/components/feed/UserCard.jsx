import React, { useState, useRef, useEffect } from 'react'
import { X, Info } from 'lucide-react'
import gsap from 'gsap'

function UserCard({ user, onSwipe, isTop }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const cardRef = useRef(null)
  const likeOverlayRef = useRef(null)
  const nopeOverlayRef = useRef(null)
  const infoButtonRef = useRef(null)
  const infoPanelRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })

  // Card entrance animation
  useEffect(() => {
    if (cardRef.current && isTop) {
      gsap.fromTo(
        cardRef.current,
        {
          scale: 0.85,
          opacity: 0,
          y: 50,
          rotateY: -10
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'back.out(1.5)',
          clearProps: 'transform'
        }
      )
    }
  }, [user._id, isTop])

  // Info button entrance
  useEffect(() => {
    if (infoButtonRef.current && !showInfo && isTop) {
      gsap.fromTo(
        infoButtonRef.current,
        { scale: 0, rotation: -90 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'back.out(2)',
          delay: 0.2
        }
      )
    }
  }, [showInfo, user._id, isTop])

  // Info panel animation
  useEffect(() => {
    if (showInfo && infoPanelRef.current) {
      gsap.fromTo(
        infoPanelRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: 'power2.out'
        }
      )
    }
  }, [showInfo])

  const handleDragStart = (clientX, clientY) => {
    if (isAnimating || !isTop) return
    setIsDragging(true)
    startPosRef.current = { x: clientX, y: clientY }
  }

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || isAnimating || !isTop) return

    const deltaX = clientX - startPosRef.current.x
    const deltaY = clientY - startPosRef.current.y

    setDragOffset({ x: deltaX, y: deltaY })

    // Animate overlays
    const likeOpacity = Math.max(0, Math.min(1, deltaX / 100))
    const nopeOpacity = Math.max(0, Math.min(1, -deltaX / 100))

    if (likeOverlayRef.current) {
      gsap.to(likeOverlayRef.current, {
        opacity: likeOpacity,
        scale: 0.9 + likeOpacity * 0.15,
        duration: 0.1
      })
    }

    if (nopeOverlayRef.current) {
      gsap.to(nopeOverlayRef.current, {
        opacity: nopeOpacity,
        scale: 0.9 + nopeOpacity * 0.15,
        duration: 0.1
      })
    }
  }

  const handleDragEnd = () => {
    if (!isDragging || isAnimating || !isTop) return
    setIsDragging(false)

    const swipeThreshold = 80
    const { x } = dragOffset

    if (Math.abs(x) > swipeThreshold) {
      const direction = x > 0 ? 'right' : 'left'
      executeSwipe(direction)
    } else {
      // Snap back
      gsap.to(cardRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.6)',
        onComplete: () => {
          setDragOffset({ x: 0, y: 0 })
        }
      })

      gsap.to([likeOverlayRef.current, nopeOverlayRef.current], {
        opacity: 0,
        scale: 0.9,
        duration: 0.25
      })
    }
  }

  const executeSwipe = (direction) => {
    setIsAnimating(true)
    const targetX = direction === 'right' ? 1000 : -1000
    const targetRotation = direction === 'right' ? 25 : -25

    gsap.to(cardRef.current, {
      x: targetX,
      y: 80,
      rotation: targetRotation,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        onSwipe?.(direction, user)
        setIsAnimating(false)
        setDragOffset({ x: 0, y: 0 })
      }
    })
  }

  const rotation = dragOffset.x * 0.025

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        ref={cardRef}
        onMouseDown={isTop ? (e) => {
          e.preventDefault()
          handleDragStart(e.clientX, e.clientY)
        } : undefined}
        onMouseMove={isDragging ? (e) => handleDragMove(e.clientX, e.clientY) : undefined}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={isTop ? (e) => {
          const touch = e.touches[0]
          handleDragStart(touch.clientX, touch.clientY)
        } : undefined}
        onTouchMove={(e) => {
          if (isDragging) {
            const touch = e.touches[0]
            handleDragMove(touch.clientX, touch.clientY)
          }
        }}
        onTouchEnd={handleDragEnd}
        style={{
          transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)` : undefined,
          cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
          transition: isDragging ? 'none' : undefined,
          pointerEvents: isTop ? 'auto' : 'none'
        }}
        className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl select-none bg-card border-4 border-border"
      >
        {/* Image */}
        <img
          className="w-full h-full object-cover"
          src={user.photo}
          alt={user.firstName}
          draggable="false"
        />

        {/* LIKE Overlay */}
        <div
          ref={likeOverlayRef}
          style={{ opacity: 0 }}
          className="absolute top-8 right-8 pointer-events-none"
        >
          <div className="border-4 border-green-500 text-green-500 text-5xl font-black px-6 py-3 rounded-2xl rotate-12 shadow-2xl bg-background/30 backdrop-blur-sm">
            CONNECT
          </div>
        </div>

        {/* NOPE Overlay */}
        <div
          ref={nopeOverlayRef}
          style={{ opacity: 0 }}
          className="absolute top-8 left-8 pointer-events-none"
        >
          <div className="border-4 border-red-500 text-red-500 text-5xl font-black px-6 py-3 rounded-2xl -rotate-12 shadow-2xl bg-background/30 backdrop-blur-sm">
            PASS
          </div>
        </div>

        {/* Info Button */}
        {!showInfo && isTop && (
          <button
            ref={infoButtonRef}
            onClick={() => setShowInfo(true)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all z-10"
          >
            <Info className="w-6 h-6 text-foreground" />
          </button>
        )}

        {/* User Info Gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
          <div className="flex items-end gap-3 mb-3">
            <h2 className="text-4xl font-bold text-white drop-shadow-2xl truncate">
              {user.firstName}
            </h2>
            <p className="text-3xl font-semibold text-white/95 drop-shadow-2xl flex-shrink-0">
              {user.age}
            </p>
          </div>

          {user.description && (
            <p className="text-sm text-white/95 drop-shadow-lg mb-3 line-clamp-2">
              {user.description}
            </p>
          )}

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
            ref={infoPanelRef}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl p-6 overflow-y-auto pointer-events-auto z-20"
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="mt-16 text-white space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {user.firstName} {user.lastName}, {user.age}
                </h3>
                {user.description && (
                  <p className="text-white/90 text-base leading-relaxed">
                    {user.description}
                  </p>
                )}
              </div>

              {user.skill && user.skill.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">Skills & Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skill.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-base bg-white/20 backdrop-blur-sm rounded-full border border-white/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.gender && (
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-white/90">Gender</h4>
                  <p className="text-white/90 text-base capitalize">{user.gender}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard