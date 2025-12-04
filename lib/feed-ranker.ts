// Enhanced addictive feed ranking: Progress + Engagement + Virality + Recency

export interface FeedItem {
  reelId: string
  courseId: string
  title: string
  mediaUrl: string
  isInProgress?: boolean
  completionRate?: number
  creatorReputation?: number
  isNewCreator?: boolean
  likesCount?: number
  views?: number
  createdAt?: Date
  userHasLiked?: boolean
}

export interface UserContext {
  userId: string
  inProgressCourses: Array<{ courseId: string; currentReelIndex: number; totalReels: number }>
  completedCourses: string[]
  seenCreators: string[]
  likedReels: string[]
}

const WEIGHTS = {
  PROGRESS: 0.35,      // Reduced to allow more discovery
  ENGAGEMENT: 0.25,    // Likes, completion rate
  VIRALITY: 0.25,      // Trending content
  RECENCY: 0.10,       // New content boost
  DISCOVERY: 0.05      // New creators
}

export function rankFeed(items: FeedItem[], userContext: UserContext): FeedItem[] {
  const now = new Date().getTime()
  
  const scored = items.map(item => {
    let score = 0
    
    // Progress signal (35%) - Keep users engaged with started courses
    const inProgress = userContext.inProgressCourses.find(p => p.courseId === item.courseId)
    if (inProgress && inProgress.currentReelIndex < inProgress.totalReels) {
      score += WEIGHTS.PROGRESS * 100
    }
    
    // Engagement signal (25%) - Completion rate and user interaction
    const completionRate = item.completionRate || 0.5
    score += WEIGHTS.ENGAGEMENT * completionRate * 100
    
    // Virality signal (25%) - Likes and views (Instagram-style)
    const likesCount = item.likesCount || 0
    const views = item.views || 1
    const likeRatio = likesCount / Math.max(views, 1)
    const viralityScore = Math.min(likeRatio * 100, 100) // Cap at 100
    score += WEIGHTS.VIRALITY * viralityScore
    
    // Recency boost (10%) - Favor fresh content
    if (item.createdAt) {
      const ageInHours = (now - new Date(item.createdAt).getTime()) / (1000 * 60 * 60)
      const recencyScore = Math.max(0, 100 - (ageInHours * 2)) // Decay over 50 hours
      score += WEIGHTS.RECENCY * recencyScore
    }
    
    // Discovery signal (5%) - New creators
    if (item.isNewCreator && !userContext.seenCreators.includes(item.courseId)) {
      score += WEIGHTS.DISCOVERY * 100
    }
    
    // Randomization factor (prevent echo chamber)
    score += Math.random() * 5
    
    return { ...item, score }
  })
  
  // Sort by score and add some randomization to top results
  const sorted = scored.sort((a, b) => (b.score || 0) - (a.score || 0))
  
  // Inject diversity: Every 5th item, show something from a different creator
  const diversified: typeof sorted = []
  const seenCreators = new Set<string>()
  
  sorted.forEach((item, index) => {
    if (index % 5 === 4) {
      // Find an item from a different creator
      const different = sorted.find(i => !seenCreators.has(i.courseId) && i !== item)
      if (different) {
        diversified.push(different)
        seenCreators.add(different.courseId)
        return
      }
    }
    diversified.push(item)
    seenCreators.add(item.courseId)
  })
  
  return diversified
}
