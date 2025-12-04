# Reel-Ed v2.0 - Quick Reference Card

## 🚀 Getting Started

```bash
npm run dev
# Visit: http://localhost:3000
# Login: learner@reeled.com / password
```

## 🔑 Demo Accounts

| Account | Email | Username | Password |
|---------|-------|----------|----------|
| Creator | creator@reeled.com | sarahjohnson | password |
| Learner | learner@reeled.com | alexsmith | password |

## 📍 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Login | `/auth/login` | User login |
| Signup | `/auth/signup` | Create account |
| Home | `/` | Course discovery |
| Feed | `/feed` | Vertical reel player |
| Profile | `/profile/[username]` | User profile |
| Creator | `/creator` | Course builder |
| Progress | `/progress` | Learning dashboard |
| Course | `/course/[id]` | Course detail |

## 🎯 Core Features

### Authentication
- ✅ Login/Signup with email & password
- ✅ Password hashing (bcrypt)
- ✅ Session management (localStorage)
- ✅ Username-based profiles

### Social Features
- ✅ Follow/unfollow users
- ✅ Like/unlike reels
- ✅ View follower/following counts
- ✅ Creator badges

### Video Features
- ✅ Upload videos (file input)
- ✅ Real video playback (HTML5)
- ✅ Autoplay & loop
- ✅ Stored in `/public/uploads/videos/`

### Feed Algorithm
- 35% Progress (finish courses)
- 25% Engagement (quality content)
- 25% Virality (likes/views)
- 10% Recency (fresh content)
- 5% Discovery (new creators)

## 🛠️ API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/signup
```

### Social
```
GET  /api/profile/[username]
POST /api/follow
POST /api/like
```

### Content
```
GET  /api/feed
GET  /api/course
POST /api/course
GET  /api/progress
POST /api/progress
POST /api/upload
```

## 📊 Database Models

```
User
├── id, email, username, name
├── password, bio, avatar
├── followers, following
└── isCreator

Course
├── id, title, description
├── creatorId, price, tags
└── reels[]

Reel
├── id, title, mediaUrl
├── views, likesCount
└── courseId

Follow
├── followerId
└── followingId

Like
├── userId
└── reelId

Progress
├── userId, courseId
├── currentReelIndex
└── reelCompletion[]
```

## 🎨 UI Components

### Pages
- `app/auth/login/page.tsx` - Login form
- `app/auth/signup/page.tsx` - Signup form
- `app/profile/[username]/page.tsx` - User profile
- `app/page.tsx` - Home page
- `app/feed/page.tsx` - Vertical feed
- `app/creator/page.tsx` - Course builder
- `app/progress/page.tsx` - Progress hub

### Components
- `components/reel-player.tsx` - Video player
- `components/course-card.tsx` - Course preview
- `components/ui/button.tsx` - Button
- `components/ui/progress.tsx` - Progress bar

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npm run db:seed          # Seed demo data
npx prisma studio        # Open database GUI

# Reset Database
rm prisma/dev.db
npx prisma db push
npm run db:seed

# Utilities
npm run lint             # Run ESLint
```

## 🐛 Troubleshooting

### Issue: Redirected to login
**Fix:** Login with demo account or create new account

### Issue: Video upload fails
**Fix:** 
```bash
mkdir -p public/uploads/videos
chmod 755 public/uploads/videos
```

### Issue: Database errors
**Fix:**
```bash
rm prisma/dev.db
npx prisma generate
npx prisma db push
npm run db:seed
```

### Issue: "User not found"
**Fix:** Run `npm run db:seed` to create demo accounts

## 📝 Quick Tasks

### Create New Account
1. Visit `/auth/signup`
2. Fill form (username, email, password)
3. Check "I want to create courses" if creator
4. Click Sign Up

### Upload Video Course
1. Login as creator
2. Go to `/creator`
3. Add title & description
4. For each reel:
   - Add title
   - Click "Choose File"
   - Select video
   - Add micro-action
5. Click Publish

### Follow & Like
1. Visit `/profile/sarahjohnson`
2. Click Follow
3. Go to `/feed`
4. Click heart icon to like reels

### View Your Profile
1. Click User icon (top-right)
2. View stats & courses
3. Click Edit Profile (if own profile)

## 🎯 Testing Checklist

- [ ] Login with demo account
- [ ] Create new account
- [ ] View profile page
- [ ] Follow/unfollow user
- [ ] Like/unlike reel
- [ ] Upload video
- [ ] Create course
- [ ] Watch reel with video
- [ ] Check feed ranking
- [ ] Logout & login again

## 📚 Documentation

| File | Description |
|------|-------------|
| `README.md` | Getting started guide |
| `WHATS_NEW.md` | New features in v2.0 |
| `UPDATES.md` | Detailed changelog |
| `MIGRATION_GUIDE.md` | Upgrade from v1.0 |
| `ARCHITECTURE.md` | Technical deep dive |
| `DEMO.md` | Demo walkthrough |
| `QUICK_START.md` | 60-second start |

## 🔐 Security Notes

### Current (MVP):
- ✅ Password hashing (bcrypt)
- ⚠️ LocalStorage sessions (not secure)
- ❌ No email verification
- ❌ No rate limiting

### Production TODO:
- JWT tokens
- HTTP-only cookies
- Email verification
- Rate limiting
- OAuth providers

## 📊 Performance

### Metrics:
- Feed ranking: < 50ms
- API response: 8-68ms
- Video upload: Depends on size
- Page load: < 3s

### Optimization:
- Server-side rendering (Next.js)
- Prisma query optimization
- Component code splitting
- Image optimization

## 🎨 Design System

### Colors:
- Primary: Purple (#9333EA)
- Secondary: Blue (#3B82F6)
- Success: Green (#10B981)
- Error: Red (#EF4444)

### Typography:
- Font: Geist Sans
- Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Spacing:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

**Version:** 2.0.0
**Last Updated:** December 4, 2024

**Quick Links:**
- [Full Documentation](README.md)
- [What's New](WHATS_NEW.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Architecture](ARCHITECTURE.md)
