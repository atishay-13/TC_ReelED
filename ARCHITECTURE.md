# Reel-Ed Architecture Documentation

## System Overview

Reel-Ed is a full-stack Next.js application that implements a hybrid learning platform combining short-form video consumption with structured course progression.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  Pages:                                                      │
│  ├─ Home (/)                  - Course discovery            │
│  ├─ Feed (/feed)              - Vertical reel player        │
│  ├─ Course (/course/[id])     - Course detail & map         │
│  ├─ Creator (/creator)        - Course builder              │
│  └─ Progress (/progress)      - Learning dashboard          │
│                                                              │
│  Components:                                                 │
│  ├─ ReelPlayer                - Full-screen video player    │
│  ├─ CourseCard                - Course preview cards        │
│  └─ UI Components             - Buttons, Progress, etc.     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js Routes)                │
├─────────────────────────────────────────────────────────────┤
│  /api/feed                    - Feed ranking algorithm       │
│  /api/course                  - Course CRUD operations       │
│  /api/progress                - Progress tracking            │
│  /api/assessments/submit      - Assessment grading           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
├─────────────────────────────────────────────────────────────┤
│  Feed Ranker (lib/feed-ranker.ts)                           │
│  ├─ Progress Signals (55%)    - In-progress course boost    │
│  ├─ Engagement Signals (30%)  - Completion rate             │
│  └─ Discovery Signals (15%)   - New creator exploration     │
│                                                              │
│  AI Assessment (mock)                                        │
│  ├─ Auto-grading              - MCQ, code, text             │
│  └─ Feedback generation       - Contextual hints            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Prisma ORM)                   │
├─────────────────────────────────────────────────────────────┤
│  Models:                                                     │
│  ├─ User                      - Learners & creators         │
│  ├─ Course                    - Micro-courses               │
│  ├─ Reel                      - Individual video lessons    │
│  ├─ Progress                  - User completion tracking    │
│  ├─ Assessment                - Quiz configurations         │
│  └─ AssessmentSubmission      - User answers & scores       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                         │
│                    (PostgreSQL for production)               │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Feed Ranking Algorithm

**Location:** `lib/feed-ranker.ts`

**Purpose:** Personalize the reel feed to balance addictive discovery with structured learning completion.

**Algorithm:**
```typescript
score = (0.55 × progressSignal) + (0.30 × engagementSignal) + (0.15 × discoverySignal)

where:
  progressSignal = isInProgress ? 100 : 0
  engagementSignal = completionRate × 100
  discoverySignal = (isNewCreator × 80) + (creatorReputation × 20)
```

**Key Features:**
- Hard constraint: Next in-progress reel appears within top N results
- Session-aware: Tracks user context across feed loads
- Configurable weights: Easy to tune via constants

**Future Enhancements:**
- ML model (collaborative filtering)
- Real-time A/B testing
- Contextual bandits for exploration

---

### 2. Progress Tracking System

**Location:** `app/api/progress/route.ts`

**Data Model:**
```typescript
Progress {
  userId: string
  courseId: string
  currentReelIndex: number
  reelCompletion: number[]  // Array of completed reel indices
  assessmentScores: number[]
  completedAt: DateTime?
  lastAccessedAt: DateTime
}
```

**Features:**
- Real-time completion tracking
- Idempotent updates (safe to call multiple times)
- Automatic course completion detection
- Last-accessed timestamp for engagement metrics

**API:**
- `GET /api/progress?userId=X` - Fetch all user progress
- `POST /api/progress` - Update reel completion

---

### 3. Course Structure

**Micro-Course Format:**
1. **Intro Reel** (30-60s) - Hook, learning objective, real-world example
2. **Core Reels** (3-7 × 30-90s) - Each teaches one sub-skill with micro-action
3. **Assessment Reel** (1 reel) - Applied mini-task with auto-grading

**Data Model:**
```typescript
Course {
  id: string
  title: string
  description: string
  creatorId: string
  price: number
  tags: string
  passThreshold: number  // Default: 70%
  reels: Reel[]
  assessments: Assessment[]
}

Reel {
  id: string
  courseId: string
  index: number
  title: string
  mediaUrl: string
  microAction: string?
  duration: number
}
```

---

### 4. Assessment System

**Location:** `app/api/assessments/submit/route.ts`

**Supported Types:**
- **MCQ** - Multiple choice with exact answer matching
- **Code** - Keyword/pattern matching (mock sandbox)
- **Text/Video** - Mock scoring (ready for AI evaluation)

**Auto-Grading Flow:**
```
1. User submits answer
2. Server validates against assessment config
3. Generate score (0-100)
4. AI generates contextual feedback
5. Return result + pass/fail status
6. Update progress if passed
```

**Future Enhancements:**
- OpenAI API integration for code evaluation
- Sandboxed code execution (Judge0, Piston)
- Peer review for video submissions
- Adaptive difficulty based on performance

---

## Database Schema

### Entity Relationships

```
User (1) ──────< (N) Course
  │                    │
  │                    └──< (N) Reel
  │                    │
  │                    └──< (N) Assessment
  │                              │
  └──< (N) Progress              │
  │                              │
  └──< (N) AssessmentSubmission ─┘
```

### Key Indexes (for production)
- `Progress.userId_courseId` (unique composite)
- `Reel.courseId_index` (unique composite)
- `Course.creatorId` (foreign key)
- `Progress.lastAccessedAt` (for engagement queries)

---

## API Endpoints

### Feed API
**GET /api/feed?userId={id}&session={id}**

**Response:**
```json
{
  "feed": [
    {
      "reelId": "uuid",
      "courseId": "uuid",
      "title": "useState Explained",
      "mediaUrl": "/videos/react-usestate.mp4",
      "score": 85.5
    }
  ],
  "userContext": {
    "inProgressCourses": [...],
    "completedCourses": [...]
  }
}
```

### Course API
**GET /api/course?id={id}**
**POST /api/course** (create)

**Response:**
```json
{
  "id": "uuid",
  "title": "Master React Hooks",
  "description": "...",
  "reels": [...],
  "assessments": [...],
  "creator": { "id": "...", "name": "..." }
}
```

### Progress API
**GET /api/progress?userId={id}**
**POST /api/progress** (update)

**Request Body:**
```json
{
  "userId": "uuid",
  "courseId": "uuid",
  "reelIndex": 2,
  "completed": true
}
```

### Assessment API
**POST /api/assessments/submit**

**Request Body:**
```json
{
  "assessmentId": "uuid",
  "userId": "uuid",
  "answer": "useState",
  "type": "code"
}
```

**Response:**
```json
{
  "submission": { "id": "...", "score": 100 },
  "passed": true,
  "feedback": "Great job! You've demonstrated understanding..."
}
```

---

## Frontend Architecture

### Page Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Home page (course discovery)
├── feed/page.tsx           # Vertical reel feed
├── course/[id]/page.tsx    # Dynamic course detail
├── creator/page.tsx        # Course builder
└── progress/page.tsx       # Progress dashboard
```

### Component Hierarchy

```
ReelPlayer
├── Video Container (full-screen)
├── Course Chip (top-left)
│   ├── Progress Ring
│   └── Course Info
├── Content Overlay (bottom)
│   ├── Title
│   └── Micro-Action Card
└── Action Buttons (right)
    ├── Like
    └── Save

CourseCard
├── Thumbnail
├── Title & Description
├── Metadata (reel count, duration)
└── Progress Bar (if in-progress)
```

### State Management

**Current:** React useState + useEffect (sufficient for MVP)

**Production Considerations:**
- Zustand for global state (user, progress)
- React Query for server state caching
- Optimistic updates for progress tracking

---

## Performance Considerations

### Current Optimizations
- Server-side rendering (Next.js)
- Prisma query optimization (includes/selects)
- Component-level code splitting

### Production Optimizations
1. **Video Delivery**
   - CDN (CloudFront)
   - Adaptive bitrate streaming (HLS)
   - Lazy loading thumbnails

2. **Database**
   - Connection pooling (PgBouncer)
   - Read replicas for feed queries
   - Redis cache for hot data

3. **Feed Algorithm**
   - Pre-compute scores (background job)
   - Cache ranked feeds (5-min TTL)
   - Batch database queries

4. **Frontend**
   - Image optimization (Next.js Image)
   - Route prefetching
   - Service worker for offline support

---

## Security Considerations

### Current (MVP)
- No authentication (demo user IDs)
- No input validation
- No rate limiting

### Production Requirements
1. **Authentication**
   - NextAuth with OAuth (Google, GitHub)
   - JWT tokens with refresh
   - Session management

2. **Authorization**
   - Course ownership checks
   - Progress update validation
   - Creator-only routes

3. **Input Validation**
   - Zod schemas for API requests
   - SQL injection prevention (Prisma)
   - XSS protection (React escaping)

4. **Rate Limiting**
   - API route throttling
   - Feed request limits
   - Assessment submission cooldown

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel Edge                          │
│  ├─ Next.js SSR                                              │
│  ├─ API Routes                                               │
│  └─ Static Assets                                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      AWS Infrastructure                      │
│  ├─ RDS PostgreSQL (primary + read replicas)                │
│  ├─ ElastiCache Redis (feed cache, sessions)                │
│  ├─ S3 + CloudFront (video CDN)                              │
│  └─ Lambda (background jobs, AI processing)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ├─ OpenAI API (assessment feedback, practice generator)    │
│  ├─ Stripe (payments, subscriptions)                         │
│  ├─ Mixpanel (analytics)                                     │
│  └─ SendGrid (email notifications)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Tests
- Feed ranking algorithm
- Progress calculation logic
- Assessment grading functions

### Integration Tests
- API endpoint responses
- Database operations
- Authentication flows

### E2E Tests (Playwright)
- Complete learner journey
- Course creation flow
- Progress tracking accuracy

---

## Monitoring & Observability

### Key Metrics
1. **Engagement**
   - DAU/MAU ratio
   - Average reels per session
   - Course completion rate

2. **Performance**
   - API response times (p50, p95, p99)
   - Feed generation latency
   - Video load time

3. **Business**
   - Creator sign-ups
   - Course publish rate
   - Revenue per user (ARPU)

### Tools (Production)
- Vercel Analytics (frontend)
- Datadog (backend monitoring)
- Sentry (error tracking)
- Mixpanel (product analytics)

---

## Scalability Roadmap

### Phase 1: MVP (Current)
- Single-region deployment
- SQLite database
- Mock AI features
- **Capacity:** 1K users

### Phase 2: Beta (3 months)
- PostgreSQL + Redis
- Real AI integration
- Authentication
- **Capacity:** 50K users

### Phase 3: Scale (6 months)
- Multi-region CDN
- Database sharding
- ML-based feed ranking
- **Capacity:** 1M+ users

---

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types
- Interface-first design

### Components
- Functional components only
- Props interface for each component
- Minimal prop drilling (max 2 levels)

### API Routes
- Try-catch error handling
- Consistent response format
- HTTP status codes

### Database
- Prisma migrations for schema changes
- Seed data for development
- Soft deletes for user data

---

**End of Architecture Documentation**
