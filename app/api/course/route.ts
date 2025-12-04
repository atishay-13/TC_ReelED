import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('id')

    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          reels: {
            orderBy: { index: 'asc' }
          },
          assessments: true,
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              bio: true,
              avatar: true,
              followers: true
            }
          }
        }
      })

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }

      return NextResponse.json(course)
    }

    const courses = await prisma.course.findMany({
      include: {
        reels: true,
        creator: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Course API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course data', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorId, title, description, price, tags, reels } = body

    const course = await prisma.course.create({
      data: {
        creatorId,
        title,
        description,
        price: price || 0,
        tags: tags || '',
        reels: {
          create: reels.map((reel: any, index: number) => ({
            index,
            title: reel.title,
            mediaUrl: reel.mediaUrl,
            microAction: reel.microAction
          }))
        }
      },
      include: {
        reels: true
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
