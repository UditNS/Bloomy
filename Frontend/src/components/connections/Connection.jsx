import React, { useEffect, useState } from 'react'
import { Users, Search, } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import ConnectionCard from './ConnectionCard'
import ConnectionSkeleton from './ConnectionSkeleton'
import axios from 'axios'
import {BASE_URL} from '../../utils/constant'
import {Link} from 'react-router'

// Main Connections Component
function Connection() {
  const [connections, setConnections] = useState([])
  const [filteredConnections, setFilteredConnections] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const res = await axios.get(BASE_URL + '/user/connections', { withCredentials: true })
      setConnections(res.data.data)
      setFilteredConnections(res.data.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching connections:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])


  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConnections(connections)
    } else {
      const filtered = connections.filter(connection =>
        `${connection.firstName} ${connection.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      setFilteredConnections(filtered)
    }
  }, [searchQuery, connections])

  const handleMessage = (connection) => {
    console.log('Message:', connection)
    // Add your message logic here
    alert(`Opening chat with ${connection.firstName}...`)
  }

  const handleRemove = (connection) => {
    console.log('Remove:', connection)
    // Add your remove logic here
    const confirmed = window.confirm(
      `Are you sure you want to remove ${connection.firstName} from your connections?`
    )
    if (confirmed) {
      setConnections(prev => prev.filter(c => c._id !== connection._id))
      alert(`${connection.firstName} removed from connections`)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              My Connections
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-15">
            {isLoading ? 'Loading...' : `${connections.length} connection${connections.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Connections List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ConnectionSkeleton key={i} />
            ))}
          </div>
        ) : filteredConnections.length > 0 ? (
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <ConnectionCard
                key={connection._id}
                connection={connection}
                onMessage={handleMessage}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : searchQuery ? (
          // No search results
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try searching with a different name
            </p>
          </div>
        ) : (
          // No connections
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No connections yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start connecting with people to see them here
            </p>
            <Link to='/feed'>
              <Button >
                Discover People
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Connection