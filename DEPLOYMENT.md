# 🚀 Deployment Guide - "The Weekend Website"

Your application is fully configured and ready to be deployed to production!

---

## Option 1: Deploy to Vercel (Recommended — Free & 1 Click)

Vercel is the official platform for Next.js. Deploying takes less than 60 seconds.

### Steps:
1. **Push to GitHub / GitLab**:
   - Initialize git in your project directory (if not already initialized):
     ```bash
     git init
     git add .
     git commit -m "Deploy production build for The Weekend Website"
     ```
   - Push your repository to **GitHub**.

2. **Deploy on Vercel**:
   - Go to **[vercel.com/new](https://vercel.com/new)**.
   - Click **Import Repository** and select your GitHub repo.
   - Click **Deploy**. Vercel will automatically build and publish your website!

3. **Your Live URL**:
   - Vercel will provide a free production SSL link, e.g. `https://the-weekend-club.vercel.app`.

---

## Option 2: Deploy to Render / Railway / Netlify

If you prefer deploying to Render or Railway as a Node web service container:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000` (auto-detected by environment)

---

## 🔐 Pre-Seeded Admin & Member Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Organizer Admin** | `admin@weekendclub.com` | `admin123` |
| **Member** | `member@weekendclub.com` | `member123` |

---

## 💳 Payment Verification Details Pre-Configured

- **Bank Name**: `SadaPay`
- **Account Title**: `Sabahat Batool`
- **Account Number**: `03254204200`
- **Ticket Price**: `Rs. 1,500` per seat
