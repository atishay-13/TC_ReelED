import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Create a new course with reels
export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, tags, reels, price, visibility } = await request.json()

    if (!userId || !title || !reels || reels.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create course with reels
    const course = await prisma.course.create({
      data: {
        creatorId: userId,
        title,
        description: description || '',
        tags: tags || '',
        price: price || 0,
        visibility: visibility || 'public',
        reels: {
          create: reels.map((reel: any, index: number) => ({
            index,
            title: reel.title,
            mediaUrl: reel.mediaUrl,
            microAction: reel.microAction,
            duration: reel.duration || 60
          }))
        }
      },
      include: {
        reels: true,
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
