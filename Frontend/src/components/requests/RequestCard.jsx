import { useState } from "react"
import { UserPlus, Check, X, Clock} from 'lucide-react'
import { Button } from '../ui/button'

function RequestCard({ request, onAccept, onReject, isProcessing }) {
  const [localProcessing, setLocalProcessing] = useState(false)

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
    <div className="bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border">
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <img
            src={request.fromUserId.photo}
            alt={request.fromUserId.firstName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary/20"
          />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <UserPlus className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
              {request.fromUserId.firstName} {request.fromUserId.lastName}
            </h3>
            {request.fromUserId.age && (
              <p className="text-sm text-muted-foreground">
                {request.fromUserId.age} years old
              </p>
            )}
          </div>

          {request.fromUserId.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {request.fromUserId.description}
            </p>
          )}

          {/* Skills */}
          {request.fromUserId.skill && request.fromUserId.skill.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {request.fromUserId.skill.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {skill}
                </span>
              ))}
              {request.fromUserId.skill.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  +{request.fromUserId.skill.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Time ago */}
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
            <Clock className="w-3 h-3" />
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <Button
            onClick={handleAccept}
            variant="success"
            disabled={isProcessing || localProcessing}
            className="flex-1 sm:flex-none sm:w-28"
          >
            {localProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Check className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Accept</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleReject}
            variant="destructive"
            disabled={isProcessing || localProcessing}
            className="flex-1 sm:flex-none sm:w-28"
          >
            {localProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <X className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Reject</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RequestCard