# Vercel Deployment Guide

Vercel is optimized for serverless functions. To deploy this Express app on Vercel, we need to make a small modification.

## Option A: Deploy as Serverless Function (Recommended for Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd school-dashboard
   vercel
   ```
   - Follow the prompts
   - Choose default settings

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Option B: Use Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
6. Click "Deploy"

## Important Notes for Vercel

- Vercel has a **serverless architecture**
- File system writes are **temporary** (resets on each invocation)
- **Data persistence**: Use Google Sheets integration or an external database
- The `data/` folder will not persist between requests
- Consider using Vercel's serverless functions for API calls

## Alternative: Use Render/Railway Instead

For this Express app with file storage, **Render** or **Railway** are better options because:
- They provide persistent file systems (on paid plans)
- Better suited for traditional Express apps
- Easier configuration

See `DEPLOYMENT.md` for Render/Railway instructions.

