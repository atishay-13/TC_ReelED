import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || 'demo-user'

  const progress = await prisma.progress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          reels: true
        }
      }
    }
  })

  return NextResponse.json(progress)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, currentReelIndex, reelIndex, completed } = body
    
    // Support both currentReelIndex and reelIndex
    const index = currentReelIndex !== undefined ? currentReelIndex : reelIndex

    if (!userId || !courseId || index === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, courseId, and currentReelIndex/reelIndex' 
      }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { reels: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    let progress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId,
          courseId,
          currentReelIndex: index,
          reelCompletion: JSON.stringify([])
        }
      })
    }

    const reelCompletion = JSON.parse(progress.reelCompletion)
    if (completed && !reelCompletion.includes(index)) {
      reelCompletion.push(index)
    }

    const isCompleted = completed && reelCompletion.length >= course.reels.length

    progress = await prisma.progress.update({
      where: { id: progress.id },
      data: {
        currentReelIndex: index,
        reelCompletion: JSON.stringify(reelCompletion),
        completedAt: isCompleted ? new Date() : null,
        lastAccessedAt: new Date()
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update progress', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
