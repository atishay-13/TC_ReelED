'use client'

import { Play } from 'lucide-react'
import { Progress } from './ui/progress'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    reelCount: number
    progress?: number
    thumbnail?: string
  }
  onClick?: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <Play className="text-white" size={48} />
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-900">{course.title}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
          <span>{course.reelCount} reels</span>
          {course.progress !== undefined && (
            <span>{Math.round(course.progress)}% complete</span>
          )}
        </div>
        {course.progress !== undefined && (
          <Progress value={course.progress} className="mt-2" />
        )}
      </div>
    </div>
  )
}
