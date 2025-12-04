'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CourseCard } from '@/components/course-card'
import { StoryViewer } from '@/components/story-viewer'
import { Play, Search, TrendingUp, User, LogOut, Plus, Users } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [stories, setStories] = useState<any[]>([])
  const [showStories, setShowStories] = useState(false)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')
    
    if (!storedUserId) {
      router.push('/auth/login')
      return
    }
    
    setUserId(storedUserId)
    setUsername(storedUsername)
  }, [])

  useEffect(() => {
    if (!userId) return
    
    Promise.all([
      fetch('/api/course').then(r => r.json()),
      fetch(`/api/progress?userId=${userId}`).then(r => r.json()),
      fetch(`/api/stories?userId=${userId}`).then(r => r.json())
    ]).then(([coursesData, progressData, storiesData]) => {
      setCourses(coursesData)
      setProgress(progressData)
      setStories(storiesData)
    })
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/auth/login')
  }

  if (!userId) {
    return null
  }

  const getProgressForCourse = (courseId: string) => {
    const prog = progress.find(p => p.courseId === courseId)
    if (!prog) return undefined
    const completed = JSON.parse(prog.reelCompletion).length
    const total = prog.course.reels.length
    return (completed / total) * 100
  }

  const inProgressCourses = courses.filter(c => {
    const prog = progress.find(p => p.courseId === c.id)
    return prog && !prog.completedAt
  })

  const availableCourses = courses.filter(c => {
    return !progress.find(p => p.courseId === c.id)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reel-Ed
          </h1>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => router.push('/upload')}
              className="p-2 hover:bg-purple-100 rounded-full text-purple-600"
              title="Upload"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={() => router.push('/search')}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => router.push(`/profile/${username}`)}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Profile"
            >
              <User size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stories */}
        {stories.length > 0 && (
          <section className="mb-8">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Add story button */}
              <button
                onClick={() => router.push('/upload')}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Plus className="text-white" size={24} />
                </div>
                <span className="text-xs text-gray-800 font-medium">Your Story</span>
              </button>

              {/* Story circles */}
              {stories.map((storyGroup: any, index: number) => (
                <button
                  key={storyGroup.user.id}
                  onClick={() => {
                    setSelectedStoryIndex(index)
                    setShowStories(true)
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {storyGroup.user.avatar ? (
                          <img 
                            src={storyGroup.user.avatar} 
                            alt={storyGroup.user.name} 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          storyGroup.user.name[0]
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-800 font-medium max-w-[64px] truncate">
                    {storyGroup.user.username}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
        {/* Continue Learning */}
        {inProgressCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Play className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    reelCount: course.reels.length,
                    progress: getProgressForCourse(course.id)
                  }}
                  onClick={() => router.push(`/course/${course.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Discover */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Discover</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <CourseCard
                key={course.id}
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  reelCount: course.reels.length
                }}
                onClick={() => router.push(`/course/${course.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="flex gap-4 justify-center mb-20">
          <button
            onClick={() => router.push('/feed')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            Open Feed
          </button>
          <button
            onClick={() => router.push('/search')}
            className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold border-2 border-gray-300 hover:border-purple-600 transition-colors"
          >
            Find People
          </button>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <Play size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => router.push('/search')}
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <Users size={24} />
            <span className="text-xs">Connect</span>
          </button>
          <button
            onClick={() => router.push('/upload')}
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <Plus size={24} />
            <span className="text-xs">Upload</span>
          </button>
          <button
            onClick={() => router.push('/saved')}
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            <span className="text-xs">Saved</span>
          </button>
          <button
            onClick={() => router.push('/progress')}
            className="flex flex-col items-center gap-1 text-gray-600"
          >
            <User size={24} />
            <span className="text-xs">Progress</span>
          </button>
        </div>
      </nav>

      {/* Story Viewer */}
      {showStories && stories.length > 0 && (
        <StoryViewer
          storyGroups={stories}
          initialGroupIndex={selectedStoryIndex}
          onClose={() => setShowStories(false)}
        />
      )}
    </div>
  )
}
