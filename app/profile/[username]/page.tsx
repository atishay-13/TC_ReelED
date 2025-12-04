'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Settings, Grid, BookOpen } from 'lucide-react'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const currentUsername = localStorage.getItem('username')
    setIsOwnProfile(currentUsername === params.username)

    fetch(`/api/profile/${params.username}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data.user)
        setCourses(data.courses)
        setIsFollowing(data.isFollowing)
      })
  }, [params.username])

  const handleFollow = async () => {
    const userId = localStorage.getItem('userId')
    await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        targetUserId: profile.id
      })
    })
    setIsFollowing(!isFollowing)
    setProfile({
      ...profile,
      followers: isFollowing ? profile.followers - 1 : profile.followers + 1
    })
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-gray-600">
            ← Back
          </button>
          {isOwnProfile && (
            <button className="text-gray-600">
              <Settings size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <img
              src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-purple-600"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/settings')}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleFollow}
                    className={isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-purple-600'}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <div className="font-bold text-lg">{courses.length}</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="font-semibold">{profile.name}</div>
                {profile.bio && (
                  <p className="text-gray-600 mt-1">{profile.bio}</p>
                )}
                {profile.isCreator && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    <BookOpen size={14} />
                    Creator
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button className="py-3 border-b-2 border-purple-600 font-semibold flex items-center gap-2">
              <Grid size={16} />
              Courses
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">No courses yet</p>
            {isOwnProfile && (
              <Button
                onClick={() => router.push('/creator')}
                className="mt-4 bg-purple-600"
              >
                Create Your First Course
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {courses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => router.push(`/course/${course.id}`)}
                className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 cursor-pointer hover:opacity-90 transition-opacity relative group"
              >
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <div className="text-center">
                    <div className="font-bold">{course.title}</div>
                    <div className="text-sm">{course.reels?.length || 0} reels</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
