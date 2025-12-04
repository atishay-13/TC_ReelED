# 🔐 Login Guide - Quick Start

## ✅ Use Demo Accounts (Recommended)

The easiest way to get started is to use the pre-configured demo accounts:

### Learner Account
```
Email: learner@reeled.com
Password: password
```

### Creator Account
```
Email: creator@reeled.com
Password: password
```

---

## 🚀 Quick Start Steps

1. **Start the app:**
   ```bash
   cd reel-ed
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Login with demo account:**
   - Email: `learner@reeled.com`
   - Password: `password`

4. **Start exploring!**

---

## 🐛 If Signup Fails

If you're getting a 500 error when trying to sign up, here's what to do:

### Option 1: Use Demo Accounts (Easiest)
Just use the demo accounts above - they're already set up and working!

### Option 2: Reset Database
```bash
cd reel-ed
rm prisma/dev.db
npx prisma db push
npm run db:seed
npm run dev
```

### Option 3: Check Server Logs
Look at the terminal where `npm run dev` is running to see the actual error message.

### Option 4: Restart Dev Server
Sometimes the server needs a restart:
```bash
# Press Ctrl+C to stop
npm run dev
```

---

## 📝 What You Can Do

### As Learner (learner@reeled.com):
- ✅ Browse courses
- ✅ Watch reels in vertical feed
- ✅ Like, comment, save reels
- ✅ Follow creators
- ✅ Track your progress

### As Creator (creator@reeled.com):
- ✅ View your 3 published courses
- ✅ Create new courses
- ✅ Upload videos
- ✅ See your followers (1,250!)
- ✅ View your profile

---

## 🎯 Recommended Flow

1. **Login** as learner
2. **Go to Feed** (bottom nav)
3. **Swipe up/down** through reels
4. **Tap heart** to like
5. **Tap bookmark** to save
6. **Tap comment** to discuss
7. **Check Saved** tab to see bookmarked reels

---

## 💡 Pro Tips

- **Password is always:** `password` (for both accounts)
- **Can't remember?** Check this file!
- **Want to switch accounts?** Click logout (top-right) and login with the other account
- **Signup not working?** Just use the demo accounts - they have everything set up!

---

## 🔧 Troubleshooting

### "Invalid email or password"
- Make sure you're using: `learner@reeled.com`
- Password is: `password` (all lowercase)

### "Redirected to login immediately"
- This is normal - the app requires authentication
- Just login with the demo account

### "500 error on signup"
- Use the demo accounts instead
- Or try resetting the database (see Option 2 above)

### "Page not loading"
- Make sure `npm run dev` is running
- Check http://localhost:3000 (not https)
- Try refreshing the page

---

## 📞 Quick Reference

| Account | Email | Password | Username |
|---------|-------|----------|----------|
| Learner | learner@reeled.com | password | alexsmith |
| Creator | creator@reeled.com | password | sarahjohnson |

---

**Remember:** The demo accounts are fully functional and have sample data. You don't need to create a new account to test the app!

🎉 **Happy Learning!**
