'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Story {
  id: string
  mediaUrl: string
  mediaType: string
  text?: string
  link?: string
  views: number
  createdAt: string
}

interface StoryGroup {
  user: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  stories: Story[]
}

interface StoryViewerProps {
  storyGroups: StoryGroup[]
  initialGroupIndex: number
  onClose: () => void
}

export function StoryViewer({ storyGroups, initialGroupIndex, onClose }: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex)
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const currentGroup = storyGroups[groupIndex]
  const currentStory = currentGroup?.stories[storyIndex]

  useEffect(() => {
    if (!currentStory) return

    // Mark story as viewed
    fetch('/api/stories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId: currentStory.id })
    })

    // Progress bar animation
    const duration = currentStory.mediaType === 'video' ? 15000 : 5000
    const interval = 50
    const increment = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [groupIndex, storyIndex])

  const nextStory = () => {
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(storyIndex + 1)
      setProgress(0)
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex(groupIndex + 1)
      setStoryIndex(0)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const previousStory = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1)
      setProgress(0)
    } else if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1)
      const prevGroup = storyGroups[groupIndex - 1]
      setStoryIndex(prevGroup.stories.length - 1)
      setProgress(0)
    }
  }

  if (!currentGroup || !currentStory) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {currentGroup.stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{
                width: index < storyIndex ? '100%' : index === storyIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {currentGroup.user.avatar ? (
              <img src={currentGroup.user.avatar} alt={currentGroup.user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              currentGroup.user.name[0]
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{currentGroup.user.name}</p>
            <p className="text-white/70 text-xs">
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>

      {/* Story content */}
      <div className="relative w-full h-full max-w-lg">
        {currentStory.mediaType === 'video' ? (
          <video
            src={currentStory.mediaUrl}
            className="w-full h-full object-contain"
            autoPlay
            muted
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-contain"
          />
        )}

        {/* Text overlay */}
        {currentStory.text && (
          <div className="absolute bottom-20 left-4 right-4">
            <p className="text-white text-lg drop-shadow-lg">{currentStory.text}</p>
          </div>
        )}

        {/* Link */}
        {currentStory.link && (
          <div className="absolute bottom-8 left-4 right-4">
            <a
              href={currentStory.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-white/20 backdrop-blur-sm text-white text-center rounded-full hover:bg-white/30"
            >
              Swipe up to learn more
            </a>
          </div>
        )}

        {/* Navigation areas */}
        <button
          onClick={previousStory}
          className="absolute left-0 top-0 bottom-0 w-1/3"
          disabled={groupIndex === 0 && storyIndex === 0}
        />
        <button
          onClick={nextStory}
          className="absolute right-0 top-0 bottom-0 w-1/3"
        />
      </div>

      {/* Navigation buttons */}
      {groupIndex > 0 && (
        <button
          onClick={() => {
            setGroupIndex(groupIndex - 1)
            setStoryIndex(0)
            setProgress(0)
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
      )}
      {groupIndex < storyGroups.length - 1 && (
        <button
          onClick={() => {
            setGroupIndex(groupIndex + 1)
            setStoryIndex(0)
            setProgress(0)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      )}
    </div>
  )
}
