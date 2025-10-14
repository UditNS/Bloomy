import React, { useEffect, useState, useRef } from 'react'
import { Users, Search, MessageCircle, UserX, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from "@/components/ui/skeleton"
import gsap from 'gsap'

// ConnectionCard Component
function ConnectionCard({ connection, onMessage, onRemove, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power2.out'
      }
    )
  }, [index])

  const handleHover = (isHovering) => {
    gsap.to(cardRef.current, {
      y: isHovering ? -4 : 0,
      scale: isHovering ? 1.01 : 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return (
    <div 
      ref={cardRef}
      className="group bg-card rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border/50"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 gap-6">
        {/* Profile Image with Gradient Ring */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full animate-pulse" />
            <img
              src={connection.photo}
              alt={connection.firstName}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate flex items-center justify-center sm:justify-start gap-2">
              {connection.firstName} {connection.lastName}
              
            </h3>
            {connection.age && (
              <p className="text-sm font-medium text-muted-foreground">
                {connection.age} years old
              </p>
            )}
          </div>

          {connection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {connection.description}
            </p>
          )}

          {/* Skills */}
          {connection.skill && connection.skill.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              {connection.skill.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {connection.skill.length > 3 && (
                <span className="px-3 py-1.5 text-xs font-semibold bg-muted text-muted-foreground rounded-lg border border-border">
                  +{connection.skill.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-3 w-full sm:w-auto justify-center">
          <Button
            onClick={() => onMessage(connection)}
            variant="outline"
            size="default"
            className="flex-1 sm:flex-none group/btn hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Message</span>
          </Button>
          <Button
            onClick={() => onRemove(connection)}
            variant="outline"
            size="default"
            className="flex-1 sm:flex-none group/btn hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-destructive dark:hover:text-destructive-foreground transition-all duration-200"
          >
            <UserX className="w-4 h-4 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectionCard