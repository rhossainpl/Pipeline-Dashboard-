# Quick Deployment Guide

Choose your preferred platform and follow the steps below.

## 🚀 Recommended: Render (Easiest & Fastest)

### Step 1: Prepare Your Code

1. Make sure all your code is in a Git repository:
   ```bash
   cd school-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   - Create a new repository on GitHub
   - Push your code:
     ```bash
     git remote add origin https://github.com/yourusername/your-repo.git
     git push -u origin main
     ```

### Step 2: Deploy on Render

1. **Go to [render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (or use "Manual Deploy")

4. **Configure:**
   - **Name**: `school-dashboard` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for persistent storage)

5. **Click "Create Web Service"**

6. **Wait for deployment** (2-3 minutes)

7. **Your app is live!** 🎉
   - URL: `https://your-app-name.onrender.com`

### Step 3: Access Your Dashboard

Open the URL in your browser. The dashboard is now accessible from anywhere!

---

## 🚂 Alternative: Railway

### Step 1: Same as Render - Push to GitHub

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Your app: `https://your-app-name.up.railway.app`

---

## ⚠️ Important Notes

### Data Persistence

**Free tier platforms have ephemeral storage**, meaning:
- Your `data/` folder may reset on redeployments
- **Solution**: Use the Google Sheets integration for data backup!

### Free Tier Limitations

- **Render**: Apps sleep after 15 min inactivity (wake up takes 30-60 sec)
- **Railway**: Limited build minutes on free tier
- Both provide HTTPS automatically

### Upgrading for Persistent Storage

If you need persistent file storage:
- Upgrade to a paid plan ($7-20/month)
- Or use Google Sheets integration (already built-in!)
- Or use an external database

---

## 🎯 Quick Start Checklist

- [ ] Code is in GitHub
- [ ] All files committed
- [ ] Chose deployment platform (Render recommended)
- [ ] Deployed successfully
- [ ] Tested the live URL
- [ ] Set up Google Sheets for data backup (optional but recommended)

---

## 🆘 Need Help?

1. Check the platform's logs for errors
2. Verify `npm start` works locally
3. Make sure all dependencies are in `package.json`
4. Check that `server.js` uses `process.env.PORT` (already done!)

---

## Next Steps After Deployment

1. **Test the live URL** - Make sure everything works
2. **Set up Google Sheets** - For data persistence (recommended)
3. **Share the URL** - With your team!
4. **Monitor** - Check logs periodically

---

**Ready to deploy?** Start with Render - it's the easiest! 🚀

