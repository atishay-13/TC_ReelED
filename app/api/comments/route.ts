import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reelId = searchParams.get('reelId')

    if (!reelId) {
      return NextResponse.json({ error: 'Reel ID required' }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { reelId },
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

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reelId, text } = await request.json()

    if (!text.trim()) {
      return NextResponse.json({ error: 'Comment text required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        reelId,
        text: text.trim()
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

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
