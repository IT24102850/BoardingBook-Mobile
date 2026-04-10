# BoardingBook Deployment Guide

## Overview
Deploy your full-stack app to make sign-in/sign-up work from any device.

### Components:
- **Frontend**: Vite React app → Vercel
- **Backend**: Node.js Express API → Render.com or Railway.app
- **Database**: MongoDB Atlas (already configured)

---

## Step 1: Deploy Backend API

Choose one option below:

### **Option A: Deploy to Render.com (Recommended - Free Tier)**

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `boardingbook-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (0.5 CPU, 512MB RAM)

5. Add Environment Variables:
   - `PORT`: `3000` (Render assigns this)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (your existing MongoDB connection string)
   - `JWT_SECRET`: (strong random string)
   - `CORS_ORIGIN`: `https://your-vercel-url.vercel.app` (add later)
   - `FRONTEND_URL`: `https://your-vercel-url.vercel.app` (add later)
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`: (your email config)

6. Deploy! You'll get a URL like: `https://boardingbook-api.onrender.com`

### **Option B: Deploy to Railway.app (Also Free)**

1. Go to [railway.app](https://railway.app) and sign up
2. Create new project
3. Deploy from GitHub
4. Set environment variables same as above
5. Get your API URL from Railway dashboard

---

## Step 2: Update Frontend for Deployed Backend

1. Update `.env` file:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Commit and push to GitHub

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your BoardingBook repository
4. Configure:
   - **Project Name**: `boardingbook`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com`

6. Deploy! You'll get: `https://boardingbook.vercel.app`

---

## Step 4: Update Backend CORS

After frontend deployment, update backend environment variable:
- `CORS_ORIGIN`: Add your Vercel URL

Example: `https://boardingbook.vercel.app`

---

## Step 5: Test from Any Device

1. Open `https://boardingbook.vercel.app` from phone, tablet, or another computer
2. Sign up with a SLIIT email (e.g., `yourmatric@my.sliit.lk`)
3. Check your email for verification link
4. Sign in with credentials

---

## Troubleshooting

**"Invalid server response" on sign-in:**
- Check that `VITE_API_URL` is set correctly
- Clear browser cache (Ctrl+Shift+Delete)
- Check CORS is configured in backend

**Email verification not working:**
- Check Gmail app-specific password is correct
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in backend

**API endpoint not responding:**
- Check the deployed backend URL is correct
- Check MongoDB connection string is valid
- View logs on Render/Railway dashboard

---

## Security Notes

⚠️ **Before going to production:**
- Change `JWT_SECRET` to a strong random value
- Never commit `.env` files with real secrets to GitHub
- Use strong database passwords
- Enable Firebase/OAuth for production sign-up (optional)

