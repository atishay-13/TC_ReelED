'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ReelPlayer } from '@/components/reel-player'
import { ArrowLeft, Heart, MessageCircle, Share2, UserPlus, UserCheck } from 'lucide-react'

interface Reel {
  id: string
  title: string
  mediaUrl: string
  microAction?: string
  index: number
  likesCount: number
}

interface Creator {
  id: string
  name: string
  username: string
  bio?: string
  avatar?: string
  followers: number
}

interface Course {
  id: string
  title: string
  description: string
  reels: Reel[]
  creator: Creator
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const isScrolling = useRef(false)
  const userId = 'demo-user'

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course?id=${params.id}`)
        const data = await response.json()
        setCourse(data)
        
        // Check if following creator
        const followRes = await fetch(`/api/follow?userId=${userId}&targetId=${data.creator.id}`)
        const followData = await followRes.json()
        setIsFollowing(followData.isFollowing)
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  // Auto-save progress and check like status
  useEffect(() => {
    if (!course) return

    const saveProgress = async () => {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId: params.id,
          currentReelIndex,
          completed: currentReelIndex === course.reels.length - 1
        })
      })
    }

    // Check if current reel is liked
    const checkLike = async () => {
      const currentReel = course.reels[currentReelIndex]
      const res = await fetch(`/api/like?userId=${userId}&reelId=${currentReel.id}`)
      const data = await res.json()
      setIsLiked(data.isLiked)
    }

    const timer = setTimeout(saveProgress, 1000)
    checkLike()
    
    return () => clearTimeout(timer)
  }, [currentReelIndex, course, params.id])

  const handleFollow = async () => {
    if (!course) return
    
    await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        targetId: course.creator.id
      })
    })
    setIsFollowing(!isFollowing)
  }

  const handleLike = async () => {
    if (!course) return
    
    const currentReel = course.reels[currentReelIndex]
    await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        reelId: currentReel.id
      })
    })
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    if (!course) return
    
    const currentReel = course.reels[currentReelIndex]
    const shareUrl = `${window.location.origin}/course/${course.id}?reel=${currentReelIndex}`
    
    if (navigator.share) {
      await navigator.share({
        title: currentReel.title,
        text: `Check out this reel from ${course.title}!`,
        url: shareUrl
      })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  // Handle scroll/swipe navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container || !course) return

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return
      
      if (e.deltaY > 50) {
        // Scroll down - next reel
        if (currentReelIndex < course.reels.length - 1) {
          isScrolling.current = true
          setCurrentReelIndex(prev => prev + 1)
          setTimeout(() => { isScrolling.current = false }, 500)
        }
      } else if (e.deltaY < -50) {
        // Scroll up - previous reel
        if (currentReelIndex > 0) {
          isScrolling.current = true
          setCurrentReelIndex(prev => prev - 1)
          setTimeout(() => { isScrolling.current = false }, 500)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return
      
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY.current - touchEndY

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentReelIndex < course.reels.length - 1) {
          // Swipe up - next reel
          isScrolling.current = true
          setCurrentReelIndex(prev => prev + 1)
          setTimeout(() => { isScrolling.current = false }, 500)
        } else if (diff < 0 && currentReelIndex > 0) {
          // Swipe down - previous reel
          isScrolling.current = true
          setCurrentReelIndex(prev => prev - 1)
          setTimeout(() => { isScrolling.current = false }, 500)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentReelIndex < course.reels.length - 1) {
        setCurrentReelIndex(prev => prev + 1)
      } else if (e.key === 'ArrowUp' && currentReelIndex > 0) {
        setCurrentReelIndex(prev => prev - 1)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentReelIndex, course])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-lg text-white">Loading...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-lg text-white">Course not found</div>
      </div>
    )
  }

  const currentReel = course.reels[currentReelIndex]

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-black relative"
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
      >
        <ArrowLeft className="text-white" size={24} />
      </button>

      {/* Progress indicator */}
      <div className="fixed top-4 left-16 right-16 z-50 flex gap-1">
        {course.reels.map((_, index) => (
          <div
            key={index}
            className={`h-0.5 flex-1 rounded-full transition-all ${
              index <= currentReelIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Reel player */}
      <ReelPlayer
        reel={currentReel}
        onNext={() => {
          if (currentReelIndex < course.reels.length - 1) {
            setCurrentReelIndex(prev => prev + 1)
          }
        }}
        onPrevious={() => {
          if (currentReelIndex > 0) {
            setCurrentReelIndex(prev => prev - 1)
          }
        }}
        showNavigation={false}
      />

      {/* Creator info & social actions - Instagram style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-end justify-between p-4">
          {/* Left side - Creator info */}
          <div className="flex-1 pointer-events-auto">
            <div 
              className="flex items-center gap-3 mb-3 cursor-pointer"
              onClick={() => router.push(`/profile/${course.creator.username}`)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {course.creator.avatar ? (
                  <img src={course.creator.avatar} alt={course.creator.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  course.creator.name[0]
                )}
              </div>
              <div>
                <p className="text-white font-semibold text-sm drop-shadow-lg">
                  {course.creator.name}
                </p>
                <p className="text-white/70 text-xs">
                  @{course.creator.username}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleFollow()
                }}
                className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isFollowing 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'bg-white text-black'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            
            <div className="mb-2">
              <h3 className="text-white font-semibold text-sm drop-shadow-lg mb-1">
                {currentReel.title}
              </h3>
              <p className="text-white/90 text-xs drop-shadow-lg">
                {course.title} • {currentReelIndex + 1}/{course.reels.length}
              </p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex flex-col items-center gap-6 pointer-events-auto ml-4">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <div className={`transition-transform ${isLiked ? 'scale-110' : ''}`}>
                <Heart 
                  className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  size={28}
                />
              </div>
              <span className="text-white text-xs font-semibold">
                {currentReel.likesCount + (isLiked ? 1 : 0)}
              </span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1"
            >
              <MessageCircle className="text-white" size={28} />
              <span className="text-white text-xs font-semibold">
                Comment
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1"
            >
              <Share2 className="text-white" size={28} />
              <span className="text-white text-xs font-semibold">
                Share
              </span>
            </button>

            {/* Creator avatar (clickable) */}
            <button
              onClick={() => router.push(`/profile/${course.creator.username}`)}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {course.creator.avatar ? (
                  <img src={course.creator.avatar} alt={course.creator.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  course.creator.name[0]
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {currentReelIndex === 0 && (
        <div className="fixed bottom-32 left-0 right-0 z-40 flex justify-center animate-bounce pointer-events-none">
          <div className="text-white/70 text-sm flex flex-col items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Swipe up for next</span>
          </div>
        </div>
      )}

      {/* Completion message */}
      {currentReelIndex === course.reels.length - 1 && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
            🎉 Course Complete!
          </div>
        </div>
      )}
    </div>
  )
}
