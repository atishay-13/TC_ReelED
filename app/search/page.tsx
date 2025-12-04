'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, UserCheck, Video } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>({ users: [], courses: [] })
  const [loading, setLoading] = useState(false)
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({})
  const userId = 'demo-user'

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], courses: [] })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data)

      // Check follow status for all users
      if (data.users && data.users.length > 0) {
        const statuses: Record<string, boolean> = {}
        await Promise.all(
          data.users.map(async (user: any) => {
            try {
              const res = await fetch(`/api/follow?userId=${userId}&targetId=${user.id}`)
              if (res.ok) {
                const followData = await res.json()
                statuses[user.id] = followData.isFollowing
              }
            } catch (err) {
              console.error('Error checking follow status:', err)
              statuses[user.id] = false
            }
          })
        )
        setFollowStatus(statuses)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (targetId: string) => {
    try {
      await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId })
      })
      setFollowStatus({ ...followStatus, [targetId]: !followStatus[targetId] })
    } catch (error) {
      console.error('Follow error:', error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search people, courses..."
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {!loading && query && (
          <>
            {/* Users */}
            {results.users && results.users.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">People</h2>
                <div className="space-y-3">
                  {results.users.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => router.push(`/profile/${user.username}`)}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user.name[0]
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                            {user.bio && (
                              <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {user.followers} followers
                              {user.isCreator && ' • Creator'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollow(user.id)}
                          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                            followStatus[user.id]
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          {followStatus[user.id] ? (
                            <span className="flex items-center gap-2">
                              <UserCheck size={16} />
                              Following
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <UserPlus size={16} />
                              Follow
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            {results.courses && results.courses.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.courses.map((course: any) => (
                    <div
                      key={course.id}
                      onClick={() => router.push(`/course/${course.id}`)}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Video className="text-white" size={48} />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>by @{course.creator.username}</span>
                          <span>{course._count.reels} reels</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.users?.length === 0 && results.courses?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-700 font-medium">No results found for "{query}"</p>
              </div>
            )}
          </>
        )}

        {!query && !loading && (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-700 font-medium">Search for people and courses</p>
          </div>
        )}
      </div>
    </div>
  )
}
