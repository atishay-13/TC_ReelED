import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const reelId = searchParams.get('reelId')

    if (!userId || !reelId) {
      return NextResponse.json({ error: 'Missing userId or reelId' }, { status: 400 })
    }

    // Get all likes and filter in memory (workaround for Prisma type issues)
    const allLikes = await prisma.like.findMany({
      where: { userId }
    })

    const like = allLikes.find((l: any) => l.reelId === reelId)

    return NextResponse.json({ isLiked: !!like })
  } catch (error) {
    console.error('Like check error:', error)
    return NextResponse.json({ error: 'Failed to check like status' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reelId } = await request.json()

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reelId: {
          userId,
          reelId
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      })

      await prisma.reel.update({
        where: { id: reelId },
        data: { likesCount: { decrement: 1 } }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          reelId
        }
      })

      await prisma.reel.update({
        where: { id: reelId },
        data: { likesCount: { increment: 1 } }
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to like/unlike' }, { status: 500 })
  }
}
