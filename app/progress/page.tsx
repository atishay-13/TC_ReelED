'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Award, TrendingUp, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function ProgressPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<any[]>([])
  const userId = 'demo-user'

  useEffect(() => {
    fetch(`/api/progress?userId=${userId}`)
      .then(r => r.json())
      .then(setProgress)
  }, [])

  const completedCourses = progress.filter(p => p.completedAt)
  const inProgressCourses = progress.filter(p => !p.completedAt)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Progress</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Award className="mx-auto mb-2 text-yellow-500" size={32} />
            <div className="text-2xl font-bold text-gray-900">{completedCourses.length}</div>
            <div className="text-sm text-gray-700 font-medium">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="mx-auto mb-2 text-blue-500" size={32} />
            <div className="text-2xl font-bold text-gray-900">{inProgressCourses.length}</div>
            <div className="text-sm text-gray-700 font-medium">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
            <div className="text-2xl font-bold text-gray-900">
              {progress.reduce((sum, p) => sum + JSON.parse(p.reelCompletion).length, 0)}
            </div>
            <div className="text-sm text-gray-700 font-medium">Reels Watched</div>
          </div>
        </div>

        {/* In Progress */}
        {inProgressCourses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Continue Learning</h2>
            <div className="space-y-4">
              {inProgressCourses.map(prog => {
                const completed = JSON.parse(prog.reelCompletion).length
                const total = prog.course.reels.length
                const percent = (completed / total) * 100

                return (
                  <div
                    key={prog.id}
                    onClick={() => router.push(`/course/${prog.courseId}`)}
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{prog.course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-700 font-medium mb-2">
                      <span>{completed} of {total} reels completed</span>
                      <span>{Math.round(percent)}%</span>
                    </div>
                    <Progress value={percent} />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedCourses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Completed Courses</h2>
            <div className="space-y-4">
              {completedCourses.map(prog => (
                <div
                  key={prog.id}
                  onClick={() => router.push(`/course/${prog.courseId}`)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{prog.course.title}</h3>
                      <p className="text-sm text-gray-700 font-medium">
                        Completed {new Date(prog.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Award className="text-yellow-500" size={32} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {progress.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Start Your Learning Journey</h3>
            <p className="text-gray-700 mb-6 font-medium">Browse courses and begin learning today</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold"
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
