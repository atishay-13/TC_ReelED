'use client'

import { useEffect, useState } from 'react'
import { VerticalFeed } from '@/components/vertical-feed'
import { useRouter } from 'next/navigation'

export default function FeedPage() {
  const router = useRouter()
  const [reels, setReels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (!storedUserId) {
      router.push('/auth/login')
      return
    }
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (!userId) return

    fetch(`/api/feed?userId=${userId}`)
      .then(r => r.json())
      .then(async data => {
        const feedItems = data.feed || []
        
        // Fetch additional data for each reel
        const enrichedReels = await Promise.all(
          feedItems.map(async (item: any) => {
            const courseResponse = await fetch(`/api/course?id=${item.courseId}`)
            const courseData = await courseResponse.json()
            
            return {
              id: item.reelId,
              title: item.title,
              mediaUrl: item.mediaUrl,
              courseId: item.courseId,
              courseName: courseData.title,
              creatorName: courseData.creator.name,
              creatorAvatar: courseData.creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${courseData.creator.username}`,
              likesCount: item.likesCount || 0,
              commentsCount: 0, // Will be fetched when needed
              microAction: 'Complete this lesson to unlock the next one',
              userHasLiked: item.userHasLiked || false,
              userHasSaved: false // Will be fetched
            }
          })
        )
        
        setReels(enrichedReels)
        setLoading(false)
      })
  }, [userId])

  const handleLike = async (reelId: string) => {
    if (!userId) return

    await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reelId })
    })

    // Update local state
    setReels(reels.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            userHasLiked: !reel.userHasLiked,
            likesCount: reel.userHasLiked ? reel.likesCount - 1 : reel.likesCount + 1
          }
        : reel
    ))
  }

  const handleSave = async (reelId: string) => {
    if (!userId) return

    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reelId })
    })

    // Update local state
    setReels(reels.map(reel => 
      reel.id === reelId 
        ? { ...reel, userHasSaved: !reel.userHasSaved }
        : reel
    ))
  }

  const handleComment = (reelId: string) => {
    // Comments are handled in the modal
    // Update comment count
    setReels(reels.map(reel => 
      reel.id === reelId 
        ? { ...reel, commentsCount: (reel.commentsCount || 0) + 1 }
        : reel
    ))
  }

  const handleShare = (reelId: string) => {
    // Share analytics
    console.log('Shared reel:', reelId)
  }

  const handleComplete = async (reelId: string) => {
    if (!userId) return

    const reel = reels.find(r => r.id === reelId)
    if (!reel) return

    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        courseId: reel.courseId,
        reelIndex: 0,
        completed: true
      })
    })
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading your personalized feed...</p>
        </div>
      </div>
    )
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="mb-4">No content available yet</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 px-6 py-2 rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <VerticalFeed
      reels={reels}
      onLike={handleLike}
      onSave={handleSave}
      onComment={handleComment}
      onShare={handleShare}
      onComplete={handleComplete}
    />
  )
}
