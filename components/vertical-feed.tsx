'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2, RotateCcw, X } from 'lucide-react'
import { Button } from './ui/button'

interface Reel {
  id: string
  title: string
  mediaUrl: string
  courseId: string
  courseName: string
  creatorName: string
  creatorAvatar: string
  likesCount: number
  commentsCount?: number
  microAction?: string
  userHasLiked?: boolean
  userHasSaved?: boolean
}

interface VerticalFeedProps {
  reels: Reel[]
  onLike: (reelId: string) => void
  onSave: (reelId: string) => void
  onComment: (reelId: string) => void
  onShare: (reelId: string) => void
  onComplete: (reelId: string) => void
}

export function VerticalFeed({ reels, onLike, onSave, onComment, onShare, onComplete }: VerticalFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const currentReel = reels[currentIndex]

  // Handle touch gestures for smooth swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    if (swipeDistance > minSwipeDistance && currentIndex < reels.length - 1) {
      // Swipe up - next reel
      goToNext()
    } else if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
      // Swipe down - previous reel
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        goToPrevious()
      } else if (e.key === 'ArrowDown' && currentIndex < reels.length - 1) {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, reels.length])

  // Auto-play current video
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [currentIndex])

  const goToNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1)
      onComplete(currentReel.id)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleLike = () => {
    onLike(currentReel.id)
  }

  const handleSave = () => {
    onSave(currentReel.id)
  }

  const handleCommentClick = async () => {
    setShowComments(true)
    // Fetch comments
    const response = await fetch(`/api/comments?reelId=${currentReel.id}`)
    const data = await response.json()
    setComments(data.comments || [])
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return

    const userId = localStorage.getItem('userId')
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        reelId: currentReel.id,
        text: newComment
      })
    })

    setNewComment('')
    handleCommentClick() // Refresh comments
    onComment(currentReel.id)
  }

  const handleShare = () => {
    setShowShare(true)
  }

  const handleShareTo = (platform: string) => {
    const url = `${window.location.origin}/reel/${currentReel.id}`
    const text = `Check out this lesson: ${currentReel.title}`

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
    }
    setShowShare(false)
    onShare(currentReel.id)
  }

  const handleRewatch = () => {
    const video = videoRefs.current[currentIndex]
    if (video) {
      video.currentTime = 0
      video.play()
    }
  }

  if (!currentReel) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p>No reels available</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Container */}
      <div className="absolute inset-0">
        {reels.map((reel, index) => (
          <div
            key={`${reel.id}-${index}`}
            className={`absolute inset-0 transition-transform duration-300 ${
              index === currentIndex ? 'translate-y-0' : index < currentIndex ? '-translate-y-full' : 'translate-y-full'
            }`}
          >
            {reel.mediaUrl.startsWith('/uploads') || reel.mediaUrl.startsWith('http') ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.mediaUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-sm opacity-75">{reel.mediaUrl}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent z-10" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 pointer-events-none">
        {/* Top Info */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <img
              src={currentReel.creatorAvatar}
              alt={currentReel.creatorName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <div className="text-white font-semibold text-sm">{currentReel.creatorName}</div>
              <div className="text-white/80 text-xs">{currentReel.courseName}</div>
            </div>
          </div>
          <div className="text-white/60 text-xs">
            {currentIndex + 1} / {reels.length}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex items-end justify-between gap-4">
          {/* Left Side - Title & Action */}
          <div className="flex-1 pointer-events-auto">
            <h2 className="text-white text-lg font-bold mb-2">{currentReel.title}</h2>
            {currentReel.microAction && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
                <p className="text-white text-sm">✨ {currentReel.microAction}</p>
              </div>
            )}
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-col gap-6 items-center pointer-events-auto">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Heart
                  className={currentReel.userHasLiked ? 'fill-red-500 text-red-500' : 'text-white'}
                  size={24}
                />
              </div>
              <span className="text-white text-xs font-semibold">
                {currentReel.likesCount > 0 ? currentReel.likesCount : ''}
              </span>
            </button>

            {/* Comment */}
            <button
              onClick={handleCommentClick}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="text-white" size={24} />
              </div>
              <span className="text-white text-xs font-semibold">
                {currentReel.commentsCount || ''}
              </span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Bookmark
                  className={currentReel.userHasSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
                  size={24}
                />
              </div>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="text-white" size={24} />
              </div>
            </button>

            {/* Rewatch */}
            <button
              onClick={handleRewatch}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <RotateCcw className="text-white" size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        {currentIndex > 0 && (
          <div className="w-1 h-12 bg-white/30 rounded-full" />
        )}
        <div className="w-1 h-16 bg-white rounded-full" />
        {currentIndex < reels.length - 1 && (
          <div className="w-1 h-12 bg-white/30 rounded-full" />
        )}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Comments</h3>
              <button onClick={() => setShowComments(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{comment.user.name}</div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
              />
              <Button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className="rounded-full bg-purple-600"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Share</h3>
              <button onClick={() => setShowShare(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => handleShareTo('copy')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Share2 size={24} />
                </div>
                <span className="text-xs">Copy Link</span>
              </button>

              <button
                onClick={() => handleShareTo('whatsapp')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <span className="text-xs">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShareTo('twitter')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">🐦</span>
                </div>
                <span className="text-xs">Twitter</span>
              </button>

              <button
                onClick={() => handleShareTo('facebook')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">📘</span>
                </div>
                <span className="text-xs">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
