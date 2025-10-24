import React, { useEffect, useState, useRef } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'
import RequestSkeleton from '../connections/ConnectionSkeleton'
import { BASE_URL } from '../../utils/constant'
import axios from 'axios'
import RequestCard from './RequestCard'
import gsap from 'gsap'
import { toast, Toaster } from 'sonner'

// Main Requests Component
function Request() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false) // Most powerful as this is maintained at parent level to prevent multiple simultaneous actions
  const navigate = useNavigate();
  
  const headerRef = useRef(null)

  useEffect(() => {
    // Animate header on mount
    gsap.fromTo(
      headerRef.current, // refers to current element
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const res = await axios.get(BASE_URL + '/user/requests', { withCredentials: true })
      setRequests(res.data.data)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error fetching requests:', error)
      setIsLoading(false)
    }
  }


  const handleAccept = async (request) => {
    setIsProcessing(true)
    try {
      // Replace with your actual API call
      await axios.post(BASE_URL + `/connection/recieve/accepted/${request._id}`, {}, { withCredentials: true })

      // Remove from list
    setRequests(prev => prev.filter(req => req._id !== request._id))

      // Show success message (you can use toast here)
      toast.success(`You are now connected with ${request.fromUserId.firstName}!`)
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Failed to accept request')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleReject = async (request) => {
    setIsProcessing(true)
    try {
      // Replace with your actual API call
      await axios.post(BASE_URL + `/connection/recieve/rejected/${request._id}`, {}, { withCredentials: true })

      // Remove from list
      setRequests(prev => prev.filter(req => req._id !== request._id))
      
      // Show success message
      toast.info(`Request from ${request.fromUserId.firstName} rejected`)
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Toaster className="hidden md:block" position="bottom-right" richColors />
        <Toaster className="block md:hidden" position="top-center" richColors />
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-60" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Inbox className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Connection Requests
              </h1>
              <p className="text-base text-muted-foreground mt-1 font-medium">
                {isLoading ? 'Loading requests...' : `${requests.length} pending request${requests.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <RequestSkeleton key={i} />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-5">
            {requests.map((request, index) => (
              <RequestCard
                key={request._id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={isProcessing}
                index={index}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Inbox className="w-14 h-14 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No pending requests
            </h3>
            <p className="text-muted-foreground text-base mb-6">
              You're all caught up! Check back later for new connection requests.
            </p>
            <Button size="lg" className="font-semibold" onClick={() => navigate('/')}>
              Discover People
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Request