import React, { useEffect, useState } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'
import RequestSkeleton from '../connections/ConnectionSkeleton'
import { BASE_URL } from '../../utils/constant'
import axios from 'axios'
import RequestCard from './RequestCard'

// Main Requests Component
function Request() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate()
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const res = await axios.get(BASE_URL + '/user/requests', { withCredentials: true })
      setRequests(res.data.data)
      console.log(res.data.data)
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

    console.log('Accepted request from:', request.fromUserId.firstName)

      // Remove from list
    setRequests(prev => prev.filter(req => req._id !== request._id))

      // Show success message (you can use toast here)
      alert(`You are now connected with ${request.fromUserId.firstName}!`)
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
      
      console.log('Rejected request from:', request.fromUserId.firstName)
      
      // Remove from list
      setRequests(prev => prev.filter(req => req._id !== request._id))
      
      // Show success message
      alert(`Request from ${request.fromUserId.firstName} rejected`)
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Connection Requests
            </h1>
          </div>
          <p className="text-muted-foreground ml-15">
            {isLoading ? 'Loading...' : `${requests.length} pending request${requests.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <RequestSkeleton key={i} />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No pending requests
            </h3>
            <p className="text-muted-foreground mb-4">
              You're all caught up! Check back later for new connection requests.
            </p>
            <Button onClick={() => navigate('/')}>
              Discover People
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Request