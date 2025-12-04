import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // 'users', 'courses', 'all'

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const results: any = {}

    // Search users (SQLite case-insensitive by default)
    if (type === 'users' || type === 'all') {
      // Get all users and filter in memory for SQLite compatibility
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          avatar: true,
          followers: true,
          isCreator: true
        }
      })
      
      const lowerQuery = query.toLowerCase()
      results.users = allUsers.filter((user: any) => 
        user.name.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowerQuery))
      ).slice(0, 20)
    }

    // Search courses (SQLite case-insensitive by default)
    if (type === 'courses' || type === 'all') {
      // Get all public courses and filter in memory for SQLite compatibility
      const allCourses = await prisma.course.findMany({
        where: {
          visibility: 'public'
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          _count: {
            select: { reels: true }
          }
        }
      })
      
      const lowerQuery = query.toLowerCase()
      results.courses = allCourses.filter((course: any) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.tags.toLowerCase().includes(lowerQuery)
      ).slice(0, 20)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
