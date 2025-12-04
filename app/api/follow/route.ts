import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const targetId = searchParams.get('targetId')

    if (!userId || !targetId) {
      return NextResponse.json({ error: 'Missing userId or targetId' }, { status: 400 })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId
        }
      }
    })

    return NextResponse.json({ isFollowing: !!follow })
  } catch (error) {
    console.error('Follow check error:', error)
    return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, targetId, targetUserId } = await request.json()
    const target = targetId || targetUserId // Support both parameter names

    if (!userId || !target) {
      return NextResponse.json({ error: 'Missing userId or targetId' }, { status: 400 })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: target
        }
      }
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      })

      return NextResponse.json({ following: false })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: target
        }
      })

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Failed to follow/unfollow' }, { status: 500 })
  }
}
