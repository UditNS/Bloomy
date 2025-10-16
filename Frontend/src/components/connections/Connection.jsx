import React, { useEffect, useState, useRef } from 'react'
import { Users, Search, } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import ConnectionCard from './ConnectionCard'
import ConnectionSkeleton from './ConnectionSkeleton'
import axios from 'axios'
import {BASE_URL} from '../../utils/constant'
import {Link} from 'react-router'
import search from '../../utils/search'
import gsap from 'gsap'
// Main Connections Component
function Connection() {
  const [connections, setConnections] = useState([])
  const [filteredConnections, setFilteredConnections] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const headerRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    // Animate header on mount
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    
    gsap.fromTo(
      searchRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    )
  }, [])

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

  useEffect(() => {
    setFilteredConnections(search(searchQuery.trim(), connections))
  }, [searchQuery, connections])

  const handleMessage = (connection) => {
    alert(`Opening chat with ${connection.firstName}...`)
  }

  const handleRemove = (connection) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${connection.firstName} from your connections?`
    )
    if (confirmed) {
      try{
        const res = axios.delete(BASE_URL + '/connection/remove/' + connection._id, {withCredentials: true})

        setConnections(prev => prev.filter(c => c._id !== connection._id))
      }catch(error){
        console.log("something went wrong" + error)
      }

      alert(`${connection.firstName} removed from connections`)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-60" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                My Connections
              </h1>
              <p className="text-base text-muted-foreground mt-1 font-medium">
                {isLoading ? 'Loading your network...' : `${connections.length} connection${connections.length !== 1 ? 's' : ''} in your network`}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, skills, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Connections List */}
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <ConnectionSkeleton key={i} />
            ))}
          </div>
        ) : filteredConnections.length > 0 ? (
          <div className="space-y-5">
            {filteredConnections.map((connection, index) => (
              <ConnectionCard
                key={connection._id}
                connection={connection}
                onMessage={handleMessage}
                onRemove={handleRemove}
                index={index}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground text-base">
              Try searching with a different keyword
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Users className="w-14 h-14 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No connections yet
            </h3>
            <p className="text-muted-foreground text-base mb-6">
              Start connecting with people to grow your network
            </p>
            <Link to='/'>
              <Button size="lg" className="font-semibold">
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