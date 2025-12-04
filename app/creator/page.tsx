'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function CreatorPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reels, setReels] = useState([
    { title: '', mediaUrl: '', microAction: '' }
  ])

  const addReel = () => {
    setReels([...reels, { title: '', mediaUrl: '', microAction: '' }])
  }

  const removeReel = (index: number) => {
    setReels(reels.filter((_, i) => i !== index))
  }

  const updateReel = (index: number, field: string, value: string) => {
    const updated = [...reels]
    updated[index] = { ...updated[index], [field]: value }
    setReels(updated)
  }

  const handleVideoUpload = async (index: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        updateReel(index, 'mediaUrl', data.url)
        alert('Video uploaded successfully!')
      } else {
        alert('Upload failed')
      }
    } catch (error) {
      alert('Upload error')
    }
  }

  const publishCourse = async () => {
    if (!title || reels.length < 3) {
      alert('Please add a title and at least 3 reels')
      return
    }

    const userId = localStorage.getItem('userId') || 'demo-creator'

    const response = await fetch('/api/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorId: userId,
        title,
        description,
        reels: reels.filter(r => r.title && r.mediaUrl)
      })
    })

    if (response.ok) {
      const course = await response.json()
      alert('Course published successfully!')
      router.push(`/course/${course.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Create Micro-Course</h1>

        {/* Course details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Course Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., Master React Hooks in 5 Minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows={3}
                placeholder="What will learners achieve?"
              />
            </div>
          </div>
        </div>

        {/* Reels */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Reels ({reels.length})</h2>
            <Button onClick={addReel} size="sm">
              <Plus size={16} className="mr-1" />
              Add Reel
            </Button>
          </div>

          <div className="space-y-4">
            {reels.map((reel, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">
                    {index === 0 ? 'Intro Reel' : index === reels.length - 1 ? 'Assessment Reel' : `Core Reel ${index}`}
                  </span>
                  {reels.length > 1 && (
                    <button
                      onClick={() => removeReel(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={reel.title}
                    onChange={(e) => updateReel(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Reel title"
                  />
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={reel.mediaUrl}
                      onChange={(e) => updateReel(index, 'mediaUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Video URL or upload below"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleVideoUpload(index, file)
                        }}
                        className="text-sm"
                      />
                      <span className="text-xs text-gray-500">or enter URL above</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={reel.microAction}
                    onChange={(e) => updateReel(index, 'microAction', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Micro-action (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={publishCourse}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Publish Course
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
