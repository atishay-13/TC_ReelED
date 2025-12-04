import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    console.log('Fetching profile for username:', params.username)
    
    // Get all users and filter (workaround for Prisma type issues)
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        isCreator: true,
        followers: true,
        following: true,
        createdAt: true
      }
    })

    console.log('All users:', allUsers.map((u: any) => u.username))

    const user = allUsers.find((u: any) => u.username === params.username)

    console.log('User found:', user)

    if (!user) {
      console.log('No user found for username:', params.username)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const courses = await prisma.course.findMany({
      where: { creatorId: user.id },
      include: {
        reels: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Courses found:', courses.length)

    return NextResponse.json({
      user,
      courses,
      isFollowing: false
    })
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json({ 
      error: 'Failed to fetch profile',
      details: error.message 
    }, { status: 500 })
  }
}
