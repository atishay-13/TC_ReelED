# Reel-Ed Quick Start

## 🚀 Get Running in 60 Seconds

```bash
# Clone or navigate to the project
cd reel-ed

# Run the automated setup
./setup.sh

# Start the development server
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📦 What Just Happened?

The setup script:
1. ✅ Installed all dependencies
2. ✅ Generated Prisma client
3. ✅ Created SQLite database
4. ✅ Seeded 3 demo courses with 13 reels
5. ✅ Created 2 demo users

---

## 🎮 Try These First

### 1. Browse Courses (Home Page)
- See 3 pre-loaded courses
- Click any course card to view details

### 2. Open the Feed
- Click "Open Feed" button
- Swipe through vertical reels
- Notice the course chip in top-left
- Mark a reel complete

### 3. View Progress
- Click Progress icon in bottom nav
- See your stats and completed reels

### 4. Create a Course
- Click "Create Course" button
- Add title: "Git Basics"
- Add 3 reels with placeholder URLs
- Click Publish

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed demo data

# Utilities
npm run lint             # Run ESLint
```

---

## 📂 Key Files to Explore

```
reel-ed/
├── app/
│   ├── page.tsx                    # 👈 Start here (Home page)
│   ├── feed/page.tsx               # Vertical feed
│   └── api/feed/route.ts           # Feed algorithm
├── lib/feed-ranker.ts              # 👈 Core innovation
├── components/reel-player.tsx      # Video player
└── prisma/schema.prisma            # Database schema
```

---

## 🎯 Demo Flow (5 minutes)

1. **Home** → Browse courses
2. **Course Detail** → View course map
3. **Feed** → Watch vertical reels
4. **Progress** → Check stats
5. **Creator** → Build a course

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database errors
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma errors
```bash
# Regenerate client
npx prisma generate
```

---

## 📚 Documentation

- **README.md** - Full setup guide
- **DEMO.md** - Demo walkthrough and talking points
- **ARCHITECTURE.md** - Technical deep dive
- **VISUAL_GUIDE.md** - UI/UX documentation
- **PROJECT_SUMMARY.md** - Project overview

---

## 🎤 Quick Pitch

> "Reel-Ed converts short-form attention into measurable mastery. We take the addictive format of TikTok and add the structure of Udemy. Our AI-powered feed ensures learners actually finish courses while discovering new topics."

---

## 💡 Key Features to Highlight

1. **Feed Algorithm** - 55% progress, 30% engagement, 15% discovery
2. **Micro-Courses** - 5 reels, 5-10 minutes total
3. **Progress Tracking** - Real-time completion tracking
4. **Creator Tools** - 10-minute course creation
5. **AI Assessment** - Instant feedback (mock in MVP)

---

## 🔗 Quick Links

- **Local App:** http://localhost:3000
- **API Docs:** See ARCHITECTURE.md
- **Demo Script:** See DEMO.md
- **GitHub:** (Add your repo URL)

---

## 🤝 Need Help?

1. Check **README.md** for detailed setup
2. Review **ARCHITECTURE.md** for technical details
3. See **DEMO.md** for demo guidance
4. Check **CHECKLIST.md** for feature status

---

**Happy Learning! 🎓**
