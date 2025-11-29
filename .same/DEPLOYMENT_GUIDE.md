# Deployment Guide - PNG SME Marketplace

## 🚀 Deploy to Production

Your code is now on GitHub: https://github.com/emabi2002/pngsme.git

Choose a hosting platform below to deploy your marketplace.

---

## ⚡ Option 1: Vercel (Recommended for Next.js)

**Why Vercel?**
- Built by the creators of Next.js
- Zero configuration for Next.js
- Free tier available
- Automatic deployments from GitHub
- Built-in SSL
- Global CDN

### Step 1: Sign Up for Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. On Vercel Dashboard, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find `emabi2002/pngsme` in the list
4. Click **"Import"**

### Step 3: Configure Environment Variables

Before deploying, add your Supabase credentials:

1. In the "Configure Project" screen, expand **"Environment Variables"**
2. Add these variables:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ksyygnnyhdzficipkgqi.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzeXlnbm55aGR6ZmljaXBrZ3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzY3MDcsImV4cCI6MjA3OTk1MjcwN30.BCrlGKxjnTa_ZmZDVayBJlFr8JsrDXOubuYKiEqCBVs
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your site will be live at: `https://pngsme-[random].vercel.app`

### Step 5: Set Up Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., pngsme.com)
3. Update DNS records as instructed
4. Vercel will automatically provision SSL

### Automatic Deployments

Every time you push to GitHub, Vercel will automatically deploy updates!

---

## 🌐 Option 2: Netlify

**Why Netlify?**
- Easy deployment
- Free tier available
- Form handling
- Serverless functions
- Built-in SSL

### Step 1: Sign Up for Netlify

1. Go to: https://netlify.com
2. Click **"Sign Up"**
3. Choose **"GitHub"**

### Step 2: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select `emabi2002/pngsme`
4. Configure build settings:
   - **Build command**: `bun run build`
   - **Publish directory**: `.next`
   - **Framework**: Next.js

### Step 3: Environment Variables

1. Go to Site Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Deploy

1. Click **"Deploy site"**
2. Site will be live at: `https://[random].netlify.app`

---

## 🐳 Option 3: Docker + Cloud Run / AWS / Azure

### Dockerfile (Already included: `netlify.toml`)

For container-based deployments:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build app
RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
```

Then deploy to:
- **Google Cloud Run**
- **AWS ECS/Fargate**
- **Azure Container Instances**

---

## ✅ Post-Deployment Checklist

After deploying to any platform:

### 1. Set Up Database
- [ ] Run `.same/supabase-schema.sql` in Supabase SQL Editor
- [ ] Run `.same/supabase-storage-setup.sql` for image storage
- [ ] Verify all 18 tables created
- [ ] Verify 3 storage buckets created

### 2. Test Core Features
- [ ] Open your live site URL
- [ ] Register a new user
- [ ] Create a seller account
- [ ] Register a business
- [ ] Add a product with image
- [ ] Browse marketplace
- [ ] Add to cart & checkout
- [ ] Verify order created

### 3. Add Test Data
- [ ] Follow `.same/SIMPLE_TEST_DATA_SETUP.md`
- [ ] Add 5-10 sample products
- [ ] Test all features from `.same/TESTING_CHECKLIST.md`

### 4. Configure Production Settings
- [ ] Set up custom domain
- [ ] Configure SSL certificate (auto on Vercel/Netlify)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Configure email notifications (future)

### 5. Security Checks
- [ ] Verify `.env.local` is NOT in GitHub (✅ already excluded)
- [ ] Verify Supabase RLS policies are active
- [ ] Test authentication flows
- [ ] Verify payment data is secure
- [ ] Check admin access is restricted

---

## 🔧 Troubleshooting

### Build Fails
**Error**: "Module not found" or "Type errors"

**Solution**:
1. Check Node.js version is 18+
2. Verify all dependencies in `package.json`
3. Run `bun install` locally to test

### Environment Variables Not Working
**Error**: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Solution**:
1. Make sure variables are added in hosting platform
2. Variable names must match exactly
3. Redeploy after adding variables

### Database Connection Fails
**Error**: "Failed to fetch from Supabase"

**Solution**:
1. Verify Supabase credentials are correct
2. Check Supabase project is not paused
3. Run database schema if not done
4. Check RLS policies are enabled

### Images Not Uploading
**Error**: "Storage bucket does not exist"

**Solution**:
1. Run `.same/supabase-storage-setup.sql`
2. Verify buckets exist in Supabase Dashboard
3. Check storage policies allow public read

---

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics**: Built-in (free tier)
- **Google Analytics**: Add GA4 tracking code
- **Plausible**: Privacy-friendly analytics

### Error Tracking
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay
- **Supabase Logs**: Database query monitoring

### Uptime Monitoring
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **StatusCake**: Global uptime checks

---

## 💰 Cost Estimates

### Free Tier (Getting Started)
- **Vercel**: Free for hobby projects
- **Netlify**: Free for personal projects
- **Supabase**: Free tier (500MB database, 1GB storage)

**Total Monthly Cost**: $0

### Production Tier (1000 users)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Custom Domain**: $12/year

**Total Monthly Cost**: ~$45/month

### Scale Tier (10,000+ users)
- **Vercel Enterprise**: Custom pricing
- **Supabase Team**: $599/month
- **CDN**: $50/month

**Total Monthly Cost**: $650+/month

---

## 🌍 Custom Domain Setup

### Buying a Domain

1. **Namecheap**: https://namecheap.com
2. **GoDaddy**: https://godaddy.com
3. **Google Domains**: https://domains.google

Recommended domains:
- `pngsme.com`
- `pngmarket.com`
- `tradepng.com`

### Connecting to Vercel

1. Buy domain
2. In Vercel, go to Project → Settings → Domains
3. Add your domain
4. Update DNS records at your registrar:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
5. Wait for DNS propagation (up to 48 hours)

---

## 🔄 Continuous Deployment

### Automatic Deployments
✅ Already configured!

When you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel/Netlify will automatically:
1. Detect the push
2. Build the project
3. Deploy to production
4. Update the live site

### Branch Previews
- Create a new branch → automatic preview URL
- Perfect for testing before merging

---

## 📱 Progressive Web App (PWA)

To make your marketplace installable as an app:

1. Add `manifest.json`
2. Add service worker
3. Configure offline support
4. Users can install to home screen

See Next.js PWA guide: https://github.com/shadowwalker/next-pwa

---

## 🎯 Production Checklist

Before going live:

- [ ] All features tested (use `.same/TESTING_CHECKLIST.md`)
- [ ] Sample products added
- [ ] Database schema applied
- [ ] Storage buckets configured
- [ ] Environment variables set
- [ ] Custom domain connected (optional)
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Backup strategy in place
- [ ] Support email configured
- [ ] Terms & Privacy pages created
- [ ] Contact information updated

---

## 🆘 Need Help?

1. **Build Issues**: Check Vercel/Netlify build logs
2. **Database Issues**: Check Supabase logs
3. **Feature Issues**: See `.same/TESTING_CHECKLIST.md`
4. **Deployment Issues**: Contact platform support

---

## 🚀 Quick Deploy Links

**Vercel**:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emabi2002/pngsme)

**Netlify**:
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/emabi2002/pngsme)

---

**Recommended Path**: Start with Vercel's free tier, then upgrade as you grow!

🇵🇬 **Ready to empower PNG's entrepreneurs!**
