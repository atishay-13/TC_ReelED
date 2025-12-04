# Migration Guide - Updating to v2.0

## 🔄 Updating Your Reel-Ed Installation

If you already have Reel-Ed v1.0 running, follow these steps to upgrade to v2.0 with authentication and video upload.

## Step 1: Pull Latest Changes

```bash
# If using git
git pull origin main

# Or if you downloaded manually, replace all files
```

## Step 2: Install New Dependencies

No new dependencies needed! We're using existing packages:
- `bcryptjs` (already installed)
- `@types/bcryptjs` (already installed)

## Step 3: Reset Database

The database schema has changed significantly. You need to reset it:

```bash
# Delete old database
rm prisma/dev.db

# Generate new Prisma client
npx prisma generate

# Push new schema
npx prisma db push

# Seed with new data (includes passwords)
npm run db:seed
```

## Step 4: Create Uploads Directory

```bash
# Create directory for uploaded videos
mkdir -p public/uploads/videos
```

## Step 5: Restart Development Server

```bash
npm run dev
```

## Step 6: Test New Features

### Test Authentication:
1. Visit http://localhost:3000
2. You'll be redirected to `/auth/login`
3. Login with:
   - Email: `learner@reeled.com`
   - Password: `password`

### Test Profile:
1. Click User icon in top-right
2. View your profile
3. Try following the demo creator

### Test Video Upload:
1. Go to `/creator`
2. Create a new course
3. Click "Choose File" for a reel
4. Upload a video file
5. Publish course

## 🔧 Troubleshooting

### Issue: "User not found" on login
**Solution:** Make sure you ran `npm run db:seed` after resetting the database.

### Issue: Video upload fails
**Solution:** 
```bash
# Ensure uploads directory exists
mkdir -p public/uploads/videos

# Check permissions
chmod 755 public/uploads/videos
```

### Issue: "Username already exists"
**Solution:** The database wasn't reset properly. Run:
```bash
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Issue: Redirected to login on every page
**Solution:** Clear your browser's localStorage:
```javascript
// In browser console:
localStorage.clear()
// Then login again
```

## 📊 Database Schema Changes

### New Tables:
- `Follow` - User follow relationships
- `Like` - Reel likes

### Modified Tables:
- `User` - Added username, bio, avatar, followers, following
- `Reel` - Added views, likesCount, createdAt

### Migration SQL (for reference):
```sql
-- Add new columns to User
ALTER TABLE User ADD COLUMN username TEXT UNIQUE;
ALTER TABLE User ADD COLUMN bio TEXT;
ALTER TABLE User ADD COLUMN avatar TEXT;
ALTER TABLE User ADD COLUMN followers INTEGER DEFAULT 0;
ALTER TABLE User ADD COLUMN following INTEGER DEFAULT 0;

-- Add new columns to Reel
ALTER TABLE Reel ADD COLUMN views INTEGER DEFAULT 0;
ALTER TABLE Reel ADD COLUMN likesCount INTEGER DEFAULT 0;
ALTER TABLE Reel ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Create Follow table
CREATE TABLE Follow (
  id TEXT PRIMARY KEY,
  followerId TEXT NOT NULL,
  followingId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (followerId) REFERENCES User(id),
  FOREIGN KEY (followingId) REFERENCES User(id),
  UNIQUE(followerId, followingId)
);

-- Create Like table
CREATE TABLE Like (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  reelId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (reelId) REFERENCES Reel(id),
  UNIQUE(userId, reelId)
);
```

## 🔐 Security Considerations

### What Changed:
- Passwords are now hashed with bcrypt
- User sessions stored in localStorage (temporary solution)
- Authentication required for all pages

### Production Recommendations:
1. Replace localStorage with JWT tokens
2. Use HTTP-only cookies
3. Add CSRF protection
4. Implement rate limiting
5. Add email verification
6. Use OAuth providers

## 📝 Code Changes Summary

### New Files:
```
app/auth/login/page.tsx
app/auth/signup/page.tsx
app/profile/[username]/page.tsx
app/api/auth/login/route.ts
app/api/auth/signup/route.ts
app/api/profile/[username]/route.ts
app/api/follow/route.ts
app/api/like/route.ts
app/api/upload/route.ts
```

### Modified Files:
```
prisma/schema.prisma          # New models and fields
prisma/seed.ts                # Added passwords and new fields
lib/feed-ranker.ts            # Enhanced algorithm
app/page.tsx                  # Added auth check
app/creator/page.tsx          # Added video upload
components/reel-player.tsx    # Added video playback
app/api/feed/route.ts         # Updated for new algorithm
```

## 🎯 Testing Checklist

After migration, test these features:

- [ ] Login with demo account
- [ ] Signup new account
- [ ] View profile page
- [ ] Follow/unfollow user
- [ ] Like/unlike reel
- [ ] Upload video file
- [ ] Create course with uploaded video
- [ ] Watch reel with real video
- [ ] Logout and login again
- [ ] Feed shows personalized content

## 🆘 Need Help?

### Common Commands:
```bash
# Reset everything
rm prisma/dev.db
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev

# Check database
npx prisma studio

# View logs
# Check terminal where npm run dev is running
```

### Demo Accounts:
```
Creator Account:
- Email: creator@reeled.com
- Username: sarahjohnson
- Password: password

Learner Account:
- Email: learner@reeled.com
- Username: alexsmith
- Password: password
```

---

**Migration Complete!** 🎉

You now have:
- ✅ Full authentication system
- ✅ Instagram-style profiles
- ✅ Video upload functionality
- ✅ Enhanced addictive feed algorithm
- ✅ Social features (follow, like)
