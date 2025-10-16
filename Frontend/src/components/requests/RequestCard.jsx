
import { useEffect, useState, useRef } from 'react'
import { Check, X, Clock, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import gsap from 'gsap'

// RequestCard Component
function RequestCard({ request, onAccept, onReject, isProcessing, index }) {
  const [localProcessing, setLocalProcessing] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0, 
        x: -30,
        scale: 0.95
      },
      { 
        opacity: 1, 
        x: 0,
        scale: 1,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power2.out'
      }
    )
  }, [index])

  const handleHover = (isHovering) => {
    gsap.to(cardRef.current, {
      x: isHovering ? 4 : 0,
      scale: isHovering ? 1.01 : 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleAccept = async () => {
    setLocalProcessing(true)
    await onAccept(request)
    setLocalProcessing(false)
  }

  const handleReject = async () => {
    setLocalProcessing(true)
    await onReject(request)
    setLocalProcessing(false)
  }

  return (
    <div 
      ref={cardRef}
      className="group bg-card rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border/50"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 gap-6">
        {/* Profile Image with Badge */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse" />
            <img
              src={request.fromUserId.photo}
              alt={request.fromUserId.firstName}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
            />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
              <UserPlus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate flex items-center justify-center sm:justify-start gap-2">
              {request.fromUserId.firstName} {request.fromUserId.lastName}
              
            </h3>
            {request.fromUserId.age && (
              <p className="text-sm font-medium text-muted-foreground">
                {request.fromUserId.age} years old
              </p>
            )}
          </div>

          {request.fromUserId.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {request.fromUserId.description}
            </p>
          )}

          {/* Skills */}
          {request.fromUserId.skill && request.fromUserId.skill.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              {request.fromUserId.skill.slice(0, 6).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {request.fromUserId.skill.length > 6 && (
                <span className="px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground rounded-lg border border-border">
                  +{request.fromUserId.skill.length - 6} more
                </span>
              )}
            </div>
          )}

          {/* Time ago */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center sm:justify-start pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">
              Received on {new Date(request.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-3 w-full sm:w-auto justify-center">
          <Button
            onClick={handleAccept}
            size="default"
            disabled={isProcessing || localProcessing}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white group/btn transition-all duration-200"
          >
            {localProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Accept</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            size="default"
            disabled={isProcessing || localProcessing}
            className="flex-1 sm:flex-none group/btn hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-destructive dark:hover:text-destructive-foreground transition-all duration-200"
          >
            {localProcessing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <X className="w-4 h-4 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Reject</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RequestCard