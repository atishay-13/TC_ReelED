import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get stories from followed users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Get users that the current user follows
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    })

    const followingIds = follows.map(f => f.followingId)
    followingIds.push(userId) // Include own stories

    // Get active stories (not expired)
    const stories = await prisma.story.findMany({
      where: {
        userId: { in: followingIds },
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group stories by user
    const groupedStories = stories.reduce((acc: any, story) => {
      const userId = story.user.id
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: []
        }
      }
      acc[userId].stories.push(story)
      return acc
    }, {})

    return NextResponse.json(Object.values(groupedStories))
  } catch (error) {
    console.error('Stories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

// Create a new story
export async function POST(request: NextRequest) {
  try {
    const { userId, mediaUrl, mediaType, text, link } = await request.json()

    if (!userId || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Stories expire after 24 hours
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const story = await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        mediaType: mediaType || 'image',
        text,
        link,
        expiresAt
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error('Story creation error:', error)
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}

// View a story (increment view count)
export async function PATCH(request: NextRequest) {
  try {
    const { storyId } = await request.json()

    if (!storyId) {
      return NextResponse.json({ error: 'Missing storyId' }, { status: 400 })
    }

    await prisma.story.update({
      where: { id: storyId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Story view error:', error)
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}
