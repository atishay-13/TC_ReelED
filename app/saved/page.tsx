'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Play } from 'lucide-react'

export default function SavedPage() {
  const router = useRouter()
  const [savedReels, setSavedReels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/auth/login')
      return
    }

    fetch(`/api/save?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        setSavedReels(data.savedReels || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading saved reels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-600">
            ← Back
          </button>
          <Bookmark className="text-purple-600" size={24} />
          <h1 className="text-xl font-bold">Saved Reels</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {savedReels.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold mb-2">No saved reels yet</h2>
            <p className="text-gray-600 mb-6">
              Save reels you want to watch later by tapping the bookmark icon
            </p>
            <button
              onClick={() => router.push('/feed')}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {savedReels.map((saved: any) => (
              <div
                key={saved.id}
                onClick={() => router.push(`/feed?reelId=${saved.reel.id}`)}
                className="relative aspect-[9/16] bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg overflow-hidden cursor-pointer group"
              >
                {/* Thumbnail */}
                {saved.reel.mediaUrl.startsWith('/uploads') || saved.reel.mediaUrl.startsWith('http') ? (
                  <video
                    src={saved.reel.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="text-white" size={48} />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {saved.reel.title}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {saved.reel.course.creator.name}
                    </p>
                  </div>
                </div>

                {/* Bookmark indicator */}
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
                  <Bookmark className="text-white fill-white" size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
