import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, reelId } = await request.json()

    const existingSave = await prisma.savedReel.findUnique({
      where: {
        userId_reelId: {
          userId,
          reelId
        }
      }
    })

    if (existingSave) {
      // Unsave
      await prisma.savedReel.delete({
        where: { id: existingSave.id }
      })

      return NextResponse.json({ saved: false })
    } else {
      // Save
      await prisma.savedReel.create({
        data: {
          userId,
          reelId
        }
      })

      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ error: 'Failed to save/unsave' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const savedReels = await prisma.savedReel.findMany({
      where: { userId },
      include: {
        reel: {
          include: {
            course: {
              include: {
                creator: {
                  select: {
                    name: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ savedReels })
  } catch (error) {
    console.error('Saved reels fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved reels' }, { status: 500 })
  }
}
