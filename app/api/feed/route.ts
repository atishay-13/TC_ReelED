import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rankFeed, FeedItem, UserContext } from '@/lib/feed-ranker'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') || 'demo-user'

  try {
    // Get user progress
    const userProgress = await prisma.progress.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            reels: true
          }
        }
      }
    })

    // Get user's liked reels
    const userLikes = await prisma.like.findMany({
      where: { userId },
      select: { reelId: true }
    })

    // Build user context
    const userContext: UserContext = {
      userId,
      inProgressCourses: userProgress
        .filter(p => !p.completedAt)
        .map(p => ({
          courseId: p.courseId,
          currentReelIndex: p.currentReelIndex,
          totalReels: p.course.reels.length
        })),
      completedCourses: userProgress
        .filter(p => p.completedAt)
        .map(p => p.courseId),
      seenCreators: [],
      likedReels: userLikes.map(l => l.reelId)
    }

    // Get all available reels with engagement data
    const courses = await prisma.course.findMany({
      include: {
        reels: {
          orderBy: { index: 'asc' }
        }
      },
      where: {
        visibility: 'public'
      }
    })

    // Build feed items with real engagement data
    const feedItems: FeedItem[] = []
    const seenReelIds = new Set<string>()
    
    for (const course of courses) {
      for (const reel of course.reels) {
        // Skip duplicate reels
        if (seenReelIds.has(reel.id)) continue
        seenReelIds.add(reel.id)
        
        feedItems.push({
          reelId: reel.id,
          courseId: course.id,
          title: reel.title,
          mediaUrl: reel.mediaUrl,
          completionRate: 0.7, // TODO: Calculate from progress data
          creatorReputation: 0.8,
          isNewCreator: false,
          likesCount: reel.likesCount,
          views: reel.views,
          createdAt: reel.createdAt,
          userHasLiked: userLikes.some(l => l.reelId === reel.id)
        })
      }
    }

    // Rank the feed
    const rankedFeed = rankFeed(feedItems, userContext)

    return NextResponse.json({
      feed: rankedFeed.slice(0, 20),
      userContext
    })
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 })
  }
}
