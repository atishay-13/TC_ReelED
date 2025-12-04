# 📱 Upload & Connect Features - Instagram Style

## 🎉 What's New

Your app now has full Instagram-style upload and networking features!

### ✨ New Features

1. **📤 Upload Content** - Create courses and post stories
2. **🔍 Search & Connect** - Find and follow people
3. **📸 Stories** - 24-hour updates like Instagram
4. **👥 Networking** - Connect with other creators and learners

---

## 🚀 How to Use

### 1. Upload Content

#### Access Upload Page
- Click the **+ (Plus)** button in the header
- Or tap **Upload** in the bottom navigation
- Or visit `/upload`

#### Choose What to Create

**📹 Create Course**
- Upload a full course with multiple reels
- Add title, description, tags
- Set price (free or paid)
- Add multiple reels with micro-actions
- Perfect for: Full tutorials, courses, series

**📸 Post Story**
- Quick 24-hour update
- Add image or video
- Include caption and link
- Expires automatically after 24 hours
- Perfect for: Announcements, behind-the-scenes, quick tips

### 2. Search & Connect

#### Find People
- Click **Search** icon in header
- Or tap **Connect** in bottom nav
- Or visit `/search`

#### Search Features
- Search by name, username, or bio
- Search for courses by title or tags
- Real-time search results
- See follower counts and creator status

#### Connect with People
- Click **Follow** button on any profile
- Visit their profile to see their content
- See their courses and activity
- Build your network

### 3. View Stories

#### Story Feed
- Stories appear at the top of home page
- Circular avatars with gradient rings
- Click **Your Story** to add your own
- Click any story to view

#### Story Viewer
- Auto-plays through stories
- Progress bars at top
- Tap left/right to navigate
- Swipe up on links
- Stories expire after 24 hours

---

## 📋 Step-by-Step Guides

### Creating Your First Course

1. **Navigate to Upload**
   ```
   Home → + Button → Create Course
   ```

2. **Fill Course Details**
   - Title: "Master React Hooks"
   - Description: "Learn all React hooks in 30 days"
   - Tags: "react, javascript, hooks"
   - Price: 0 (free) or set amount

3. **Add Reels**
   - Click "Add Reel"
   - Enter reel title
   - Add video URL (e.g., `/uploads/video1.mp4`)
   - Optional: Add micro-action
   - Repeat for each lesson

4. **Publish**
   - Click "Publish Course 🚀"
   - Course goes live immediately
   - Appears in feed and your profile

### Posting Your First Story

1. **Navigate to Upload**
   ```
   Home → + Button → Post Story
   ```

2. **Add Content**
   - Media URL: Link to image/video
   - Media Type: Image or Video
   - Caption: "Working on something exciting!"
   - Link: Optional swipe-up link

3. **Share**
   - Click "Share Story 📸"
   - Story visible for 24 hours
   - Appears in followers' feeds

### Finding & Following People

1. **Open Search**
   ```
   Home → Search Icon → Type name
   ```

2. **Browse Results**
   - People section shows users
   - Courses section shows content
   - Click profiles to view details

3. **Follow Someone**
   - Click "Follow" button
   - Button changes to "Following"
   - See their stories and updates
   - Visit their profile anytime

---

## 🎨 UI Components

### Home Page Updates

```
┌─────────────────────────────┐
│ Reel-Ed  [+][🔍][👤][⚡]   │  ← Header with new buttons
├─────────────────────────────┤
│ [+Your] [@user1] [@user2]   │  ← Stories row
│  Story                      │
├─────────────────────────────┤
│ Continue Learning...        │
│ Discover...                 │
└─────────────────────────────┘
│ [Home][Connect][+][💾][👤] │  ← Bottom nav
└─────────────────────────────┘
```

### Upload Page

```
Choose:
┌──────────────┐  ┌──────────────┐
│   📹 Video   │  │   📸 Story   │
│ Create Course│  │  Post Story  │
└──────────────┘  └──────────────┘
```

### Search Page

```
┌─────────────────────────────┐
│ 🔍 Search people, courses   │
├─────────────────────────────┤
│ People                      │
│ ┌─────────────────────────┐ │
│ │ 👤 John Doe  [Follow]   │ │
│ │ @johndoe • 1.2K follow  │ │
│ └─────────────────────────┘ │
│                             │
│ Courses                     │
│ ┌─────────────────────────┐ │
│ │ 📹 React Masterclass    │ │
│ │ by @johndoe • 12 reels  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 🔧 API Endpoints

### Upload API
```typescript
POST /api/upload
Body: {
  userId: string
  title: string
  description: string
  tags: string
  reels: Array<{
    title: string
    mediaUrl: string
    microAction?: string
    duration?: number
  }>
  price?: number
  visibility?: 'public' | 'private'
}
```

### Stories API
```typescript
// Get stories
GET /api/stories?userId={userId}

// Create story
POST /api/stories
Body: {
  userId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  text?: string
  link?: string
}

// View story (increment views)
PATCH /api/stories
Body: { storyId: string }
```

### Search API
```typescript
GET /api/search?q={query}&type={all|users|courses}

Response: {
  users: Array<User>
  courses: Array<Course>
}
```

---

## 💡 Tips & Best Practices

### For Creators

1. **Course Creation**
   - Keep reels short (30-90 seconds)
   - Add clear micro-actions
   - Use descriptive titles
   - Tag appropriately for discovery

2. **Story Usage**
   - Post regularly (daily is ideal)
   - Use for announcements
   - Share behind-the-scenes
   - Add links to drive traffic

3. **Networking**
   - Follow other creators
   - Engage with their content
   - Build your community
   - Cross-promote courses

### For Learners

1. **Discovery**
   - Use search to find topics
   - Follow favorite creators
   - Check stories for updates
   - Save courses for later

2. **Engagement**
   - Like helpful reels
   - Comment on content
   - Share with friends
   - Track your progress

---

## 🎯 Navigation Quick Reference

| Action | Location | Shortcut |
|--------|----------|----------|
| Upload Course | Header + button | `/upload` |
| Post Story | Header + button | `/upload` |
| Search People | Header 🔍 | `/search` |
| View Profile | Header 👤 | `/profile/{username}` |
| View Stories | Home page circles | Click story |
| Connect | Bottom nav | `/search` |

---

## 📊 Database Schema

### Story Model
```prisma
model Story {
  id          String   @id @default(uuid())
  userId      String
  mediaUrl    String
  mediaType   String   @default("image")
  text        String?
  link        String?
  views       Int      @default(0)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  
  user        User     @relation(...)
}
```

---

## 🎬 Example Workflows

### Workflow 1: Creator Posts Course
1. Click + button
2. Choose "Create Course"
3. Fill in details
4. Add 5 reels
5. Publish
6. Share story announcing new course
7. Followers see story
8. Course appears in feed

### Workflow 2: Learner Discovers Content
1. Open search
2. Type "React"
3. Find creator
4. Click Follow
5. View their profile
6. Enroll in course
7. See their stories
8. Stay updated

### Workflow 3: Story Engagement
1. Creator posts story
2. Story appears in feed
3. Followers view story
4. Click swipe-up link
5. Visit course page
6. Enroll and learn
7. Story expires after 24h

---

## 🚀 What's Next?

Your app now has:
- ✅ Upload courses
- ✅ Post stories
- ✅ Search & connect
- ✅ Follow system
- ✅ Story viewer
- ✅ Full networking

Ready to use! Start creating and connecting! 🎉
