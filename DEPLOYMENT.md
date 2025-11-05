# Deployment Guide

This guide will help you deploy your School Launch Dashboard online so it's accessible from anywhere.

## Deployment Options

### Option 1: Render (Recommended - Easiest)

[Render](https://render.com) offers a free tier and is perfect for Node.js apps.

#### Steps:

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for free (use GitHub login for easiest setup)

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or create a new one)
   - Or use "Manual Deploy" if you don't have a repo

3. **Configure the Service**
   - **Name**: `school-launch-dashboard` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: Leave as default (or `school-dashboard` if deploying from subdirectory)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Your app will be available at: `https://your-app-name.onrender.com`

5. **Environment Variables (Optional)**
   - If you need to set PORT, you can add it in the Environment section
   - Render sets PORT automatically, so you usually don't need this

**Note**: Free tier services on Render spin down after 15 minutes of inactivity. They'll wake up when you access them (may take 30-60 seconds).

---

### Option 2: Railway

[Railway](https://railway.app) is another excellent option with a free tier.

#### Steps:

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up (GitHub login recommended)

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo" or "Empty Project"

3. **Add Service**
   - If using GitHub: Select your repository
   - Railway will auto-detect it's a Node.js app
   - It will automatically run `npm install` and `npm start`

4. **Deploy**
   - Railway will automatically deploy
   - Your app will be available at: `https://your-app-name.up.railway.app`

5. **Custom Domain (Optional)**
   - Add a custom domain in the Settings tab

---

### Option 3: Fly.io

[Fly.io](https://fly.io) offers global deployment with a generous free tier.

#### Steps:

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login to Fly**
   ```bash
   fly auth login
   ```

3. **Initialize Your App**
   ```bash
   cd school-dashboard
   fly launch
   ```
   - Follow the prompts
   - Choose a region close to you
   - Don't deploy a database (we're using JSON file storage)

4. **Deploy**
   ```bash
   fly deploy
   ```

5. **Your App URL**
   - Will be: `https://your-app-name.fly.dev`

---

### Option 4: Vercel (Serverless)

For Vercel, we need to modify the app slightly. See `VERCEL_DEPLOYMENT.md` for details.

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [x] All dependencies are in `package.json`
- [x] Server uses `process.env.PORT` for port configuration
- [x] Static files are served from `public` directory
- [x] No hardcoded localhost URLs

## Post-Deployment

### Data Persistence

**Important**: The free tiers of most platforms have **ephemeral file systems**. This means:
- Your `data/` folder may be reset on redeployments
- Consider using:
  - Google Sheets integration (already built-in!)
  - A database (PostgreSQL, MongoDB, etc.)
  - External file storage (S3, etc.)

### Environment Variables

If you need to configure settings:
1. Go to your hosting platform's dashboard
2. Find "Environment Variables" or "Config Vars"
3. Add variables like:
   - `PORT` (usually auto-set)
   - `NODE_ENV=production`

### Monitoring

- Check your platform's logs for errors
- Monitor uptime and performance
- Set up alerts if available

## Troubleshooting

### App won't start
- Check logs in your hosting platform
- Verify `npm start` works locally
- Ensure all dependencies are in `package.json`

### Data not persisting
- This is expected on free tiers
- Use Google Sheets integration for persistence
- Or upgrade to a paid plan with persistent storage

### Port errors
- Most platforms set PORT automatically
- The code uses `process.env.PORT || 3000` which handles this

## Quick Deploy Commands

### Render
Just push to GitHub and connect the repo in Render dashboard.

### Railway
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Fly.io
```bash
fly deploy
```

---

## Recommended: Render for Quickest Setup

For the fastest deployment, I recommend **Render**:
1. Free tier available
2. Easy GitHub integration
3. Automatic HTTPS
4. Simple dashboard

Need help with a specific platform? Let me know!

