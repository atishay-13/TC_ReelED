'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Upload, Video } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState<'choose' | 'course' | 'story'>('choose')
  const [loading, setLoading] = useState(false)
  
  // Course form
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    tags: '',
    visibility: 'public',
    price: 0
  })
  const [reels, setReels] = useState<any[]>([])
  
  // Story form
  const [storyData, setStoryData] = useState({
    mediaUrl: '',
    mediaType: 'image',
    text: '',
    link: ''
  })

  const addReel = () => {
    setReels([...reels, { title: '', mediaUrl: '', microAction: '', duration: 60 }])
  }

  const removeReel = (index: number) => {
    setReels(reels.filter((_, i) => i !== index))
  }

  const updateReel = (index: number, field: string, value: any) => {
    const updated = [...reels]
    updated[index][field] = value
    setReels(updated)
  }

  const handleUploadCourse = async () => {
    if (!courseData.title || reels.length === 0) {
      alert('Please add a title and at least one reel')
      return
    }

    setLoading(true)
    try {
      const userId = localStorage.getItem('userId') || 'demo-user'
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...courseData,
          reels
        })
      })

      const course = await response.json()
      alert('Course uploaded successfully! 🎉')
      router.push(`/course/${course.id}`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload course')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadStory = async () => {
    if (!storyData.mediaUrl) {
      alert('Please add media URL')
      return
    }

    setLoading(true)
    try {
      const userId = localStorage.getItem('userId') || 'demo-user'
      await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...storyData
        })
      })

      alert('Story posted! It will expire in 24 hours 📸')
      router.push('/')
    } catch (error) {
      console.error('Story upload error:', error)
      alert('Failed to post story')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">What do you want to create?</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Course */}
            <button
              onClick={() => setStep('course')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Create Course</h2>
              <p className="text-gray-700 text-sm">
                Upload a full course with multiple reels and micro-actions
              </p>
            </button>

            {/* Upload Story */}
            <button
              onClick={() => setStep('story')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Post Story</h2>
              <p className="text-gray-700 text-sm">
                Share a quick update that expires in 24 hours
              </p>
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-8 w-full py-3 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (step === 'course') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-3xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
            <button onClick={() => setStep('choose')} className="text-gray-700 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            {/* Course Info */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Title *</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g., Master React in 30 Days"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
                placeholder="What will students learn?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <input
                  type="text"
                  value={courseData.tags}
                  onChange={(e) => setCourseData({ ...courseData, tags: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="react, javascript"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price ($)</label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Reels */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Reels *</h3>
                <button
                  onClick={addReel}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus size={20} />
                  Add Reel
                </button>
              </div>

              {reels.length === 0 && (
                <p className="text-gray-700 text-center py-8 font-medium">No reels added yet. Click "Add Reel" to start.</p>
              )}

              {reels.map((reel, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 relative">
                  <button
                    onClick={() => removeReel(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>

                  <p className="text-sm font-semibold mb-3">Reel {index + 1}</p>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={reel.title}
                      onChange={(e) => updateReel(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Reel title"
                    />
                    <input
                      type="text"
                      value={reel.mediaUrl}
                      onChange={(e) => updateReel(index, 'mediaUrl', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Video URL (e.g., /uploads/video.mp4)"
                    />
                    <input
                      type="text"
                      value={reel.microAction}
                      onChange={(e) => updateReel(index, 'microAction', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Micro-action (optional)"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleUploadCourse}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Publish Course 🚀'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'story') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Post Story</h1>
            <button onClick={() => setStep('choose')} className="text-gray-700 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Media URL *</label>
              <input
                type="text"
                value={storyData.mediaUrl}
                onChange={(e) => setStoryData({ ...storyData, mediaUrl: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Image or video URL"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Media Type</label>
              <select
                value={storyData.mediaType}
                onChange={(e) => setStoryData({ ...storyData, mediaType: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Caption</label>
              <textarea
                value={storyData.text}
                onChange={(e) => setStoryData({ ...storyData, text: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                rows={3}
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Link (optional)</label>
              <input
                type="text"
                value={storyData.link}
                onChange={(e) => setStoryData({ ...storyData, link: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Add a swipe-up link"
              />
            </div>

            <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-orange-900 font-medium">
                📸 Your story will be visible for 24 hours and then automatically disappear.
              </p>
            </div>

            <button
              onClick={handleUploadStory}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Share Story 📸'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
