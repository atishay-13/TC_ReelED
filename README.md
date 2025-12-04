<<<<<<< HEAD
# Reel-Ed - Bite-Sized Learning Platform

**Tagline:** Learn in Minutes, Master for Life

Reel-Ed merges the addictive format of short-form video (Instagram Reels) with structured, credible learning (Udemy). This MVP demonstrates the core concept: personalized feed ranking, micro-course consumption, progress tracking, and creator tools.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize database and seed demo data
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features Implemented

### Learner Experience
- **Home Feed** - Discover courses with continue learning section
- **Personalized Feed** - AI-ranked vertical reel feed (55% progress, 30% engagement, 15% discovery)
- **Course Pages** - Structured course map with progress tracking
- **Reel Player** - Full-screen vertical video player with micro-actions
- **Progress Hub** - Track completed courses, badges, and learning stats

### Creator Experience
- **Micro-Course Builder** - Simple 3-step course creation
  - Intro Reel (hook + learning objective)
  - Core Reels (3-7 lessons with micro-actions)
  - Assessment Reel (auto-graded quiz)

### Backend & AI
- **Feed Ranking Algorithm** - Prioritizes in-progress courses while maintaining discovery
- **Progress Tracking** - Real-time completion tracking per reel
- **AI Assessment** - Mock auto-grading with instant feedback
- **RESTful API** - Clean endpoints for feed, courses, progress, assessments

## 🗂️ Project Structure

```
reel-ed/
├── app/
│   ├── page.tsx              # Home page
│   ├── feed/page.tsx         # Vertical feed
│   ├── course/[id]/page.tsx  # Course detail
│   ├── creator/page.tsx      # Course builder
│   ├── progress/page.tsx     # Progress hub
│   └── api/
│       ├── feed/route.ts     # Feed ranking
│       ├── course/route.ts   # Course CRUD
│       ├── progress/route.ts # Progress tracking
│       └── assessments/submit/route.ts
├── components/
│   ├── reel-player.tsx       # Vertical video player
│   ├── course-card.tsx       # Course preview card
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── db.ts                 # Prisma client
│   └── feed-ranker.ts        # Feed algorithm
└── prisma/
    ├── schema.prisma         # Database schema
    └── seed.ts               # Demo data
```

## 🎯 Core Innovation: Feed Ranking

The feed algorithm balances addictive scrolling with structured learning:

**Ranking Signals:**
- **55% Progress & Mastery** - Prioritizes finishing in-progress courses
- **30% Engagement** - Completion rate normalized by views
- **15% Discovery** - New creator exploration and topic diversity

**Session Logic:**
- Hard constraint: Show next required reel within X positions if user <80% through course
- Soft constraints: Diversity slots every Nth recommendation
- Cold-start: Bandit-style explore/exploit for new users

## 📊 Database Schema

- **Users** - Learners and creators
- **Courses** - Micro-courses with metadata
- **Reels** - Individual video lessons (30-90s each)
- **Progress** - Per-user course completion tracking
- **Assessments** - Auto-graded quizzes
- **AssessmentSubmissions** - User answers and scores

## 🧪 Demo Data

The seed script creates:
- 3 sample courses (React Hooks, Python Data Structures, UI Design)
- 2 demo users (creator and learner)
- 13 total reels across all courses

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Backend:** Next.js API Routes
- **Database:** SQLite (Prisma ORM)
- **AI:** Mock implementation (ready for OpenAI integration)

## 📱 Key Screens

1. **Home** - Course discovery with continue learning
2. **Feed** - Vertical swipe reel player
3. **Course Detail** - Course map with progress
4. **Creator Builder** - Drag-and-drop course creation
5. **Progress Hub** - Achievements and stats

## 🔄 User Flows

### Learner Journey
1. Browse courses on home page
2. Start course → View course map
3. Watch reels in vertical feed
4. Complete micro-actions
5. Take assessment
6. Earn badge → Progress hub

### Creator Journey
1. Click "Create Course"
2. Add title and description
3. Upload/add 3-7 reels
4. Set micro-actions per reel
5. Publish → Course goes live

## 🚧 MVP Limitations

- Video playback uses placeholders (no actual video CDN)
- AI feedback is mocked (ready for OpenAI API)
- No authentication (uses demo user IDs)
- No payment integration (Stripe stub ready)
- SQLite database (production would use PostgreSQL)

## 🎨 Design Principles

**Addictiveness (Reels-Style):**
- Vertical swipe navigation
- Minimal UI chrome
- Quick gestures (like, save, speed control)
- Dopamine hits (confetti on completion)

**Structure (Udemy-Style):**
- Persistent course chip showing progress
- Course map with checkmarks
- Learning objectives per reel
- Assessments with pass/fail criteria

## 📈 Next Steps for Production

1. **Video Infrastructure** - AWS S3 + CloudFront CDN
2. **Authentication** - NextAuth with OAuth providers
3. **AI Integration** - OpenAI API for adaptive practice generator
4. **Payments** - Stripe subscriptions + marketplace
5. **Analytics** - Mixpanel/Amplitude for engagement tracking
6. **Mobile Apps** - React Native for iOS/Android
7. **Creator Payouts** - Automated revenue sharing
8. **Social Features** - Share achievements, peer review

## 🎓 Product Differentiator

Reel-Ed converts short-form attention into measurable mastery by sequencing bite-sized, creator-driven micro-courses with embedded AI-generated practice and automatic assessment. It succeeds where Reels is shallow and Udemy is long by making every swipe both addictive and educational.

## 📝 API Endpoints

- `GET /api/feed?userId=X` - Personalized feed
- `GET /api/course?id=X` - Course details
- `POST /api/course` - Create course
- `GET /api/progress?userId=X` - User progress
- `POST /api/progress` - Update progress
- `POST /api/assessments/submit` - Submit assessment

## 🤝 Contributing

This is an MVP prototype. For production deployment, consider:
- Scalable video infrastructure
- Real-time progress sync
- Advanced feed ML models
- Creator analytics dashboard
- Mobile-first optimization

---

Built with ❤️ for the future of bite-sized learning
=======

>>>>>>> 3598ba68fb429968c911fff051229f6453b327cd
