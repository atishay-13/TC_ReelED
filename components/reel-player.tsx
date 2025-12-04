'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ReelPlayerProps {
  reel: {
    id: string
    title: string
    mediaUrl: string
    microAction?: string
  }
  courseInfo?: {
    title: string
    currentIndex: number
    totalReels: number
    progress: number
  }
  onNext?: () => void
  onPrevious?: () => void
  onComplete?: () => void
  showNavigation?: boolean
}

export function ReelPlayer({ reel, courseInfo, onNext, onPrevious, onComplete, showNavigation = true }: ReelPlayerProps) {

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Video player */}
      {reel.mediaUrl.startsWith('/uploads') || reel.mediaUrl.startsWith('http') ? (
        <video
          src={reel.mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-sm opacity-75">Video: {reel.mediaUrl}</p>
          </div>
        </div>
      )}

      {/* Course chip - top left */}
      {courseInfo && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <div className="relative w-8 h-8">
            <svg className="transform -rotate-90" width="32" height="32">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${courseInfo.progress * 87.96} 87.96`}
              />
            </svg>
          </div>
          <div className="text-white text-xs">
            <div className="font-semibold">{courseInfo.title}</div>
            <div className="opacity-75">Reel {courseInfo.currentIndex}/{courseInfo.totalReels}</div>
          </div>
        </div>
      )}

      {/* Title and action buttons - bottom left */}
      <div className="absolute bottom-20 left-4 right-20 text-white">
        <h2 className="text-xl font-bold mb-2">{reel.title}</h2>
        {reel.microAction && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
            <p className="text-sm mb-2">✨ Micro-Action:</p>
            <p className="text-sm">{reel.microAction}</p>
            <button
              onClick={onComplete}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1 rounded-full"
            >
              Mark Complete
            </button>
          </div>
        )}
      </div>

      {/* Swipe indicators - only show if showNavigation is true */}
      {showNavigation && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-4 text-white/50">
          {onPrevious && (
            <button onClick={onPrevious} className="hover:text-white">
              <ChevronUp size={32} />
            </button>
          )}
          {onNext && (
            <button onClick={onNext} className="hover:text-white">
              <ChevronDown size={32} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
