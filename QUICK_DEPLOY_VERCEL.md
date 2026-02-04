# Quick Deploy to Vercel

This guide will get LogLens deployed to production in under 10 minutes.

---

## Prerequisites

- [ ] GitHub account with LogLens repository
- [ ] Vercel account ([sign up free](https://vercel.com/signup))
- [ ] WorkOS account ([sign up free](https://workos.com/))

---

## Step 1: WorkOS Setup (5 minutes)

### 1.1 Create Production Environment

1. Go to [WorkOS Dashboard](https://dashboard.workos.com/)
2. Create a **new environment** (or use existing production environment)
3. Note your credentials:
   - **Client ID**: `your_workos_client_id_here`
   - **API Key**: `your_workos_api_key_here`

### 1.2 Configure Redirect URI

1. In WorkOS Dashboard, go to **Redirects**
2. Add your production URL:
   ```
   https://yourdomain.com/api/auth/callback
   ```
   (Replace `yourdomain.com` with your actual domain)

### 1.3 Generate Cookie Password

Run this command to generate a secure password:

```bash
openssl rand -base64 32
```

Save the output - you'll need it for Vercel.

---

## Step 2: Vercel Deployment (3 minutes)

### 2.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your LogLens repository
4. Click **Import**

### 2.2 Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Set Environment Variables

Click **Environment Variables** and add:

```bash
# WorkOS Authentication
WORKOS_CLIENT_ID=your_workos_client_id_here
WORKOS_API_KEY=your_workos_api_key_here
WORKOS_REDIRECT_URI=https://yourdomain.vercel.app/api/auth/callback
WORKOS_COOKIE_PASSWORD=<paste-your-generated-password>

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
```

**Important**:
- Replace `yourdomain.vercel.app` with your actual Vercel domain
- Use your **production** WorkOS credentials (not test keys)
- Set variables for **Production**, **Preview**, and **Development**

### 2.4 Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. Vercel will provide a URL: `https://yourdomain.vercel.app`

---

## Step 3: Custom Domain (Optional, 2 minutes)

### 3.1 Add Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `loglens.app`)
3. Follow DNS configuration instructions

### 3.2 Update Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Update `WORKOS_REDIRECT_URI`:
   ```
   https://loglens.app/api/auth/callback
   ```
3. Update `NEXT_PUBLIC_APP_URL`:
   ```
   https://loglens.app
   ```
4. Click **Save**

### 3.3 Update WorkOS

1. Go to WorkOS Dashboard → **Redirects**
2. Add your custom domain:
   ```
   https://loglens.app/api/auth/callback
   ```

### 3.4 Redeploy

1. In Vercel, go to **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**

---

## Step 4: Verify Deployment (2 minutes)

### 4.1 Test Landing Page

1. Visit your deployment URL
2. Verify landing page loads correctly
3. Check for console errors (F12 → Console)

### 4.2 Test Authentication

1. Click **Get Started** or **Sign In**
2. You should be redirected to WorkOS login
3. Sign in with your WorkOS account
4. Verify redirect back to dashboard

### 4.3 Test Dashboard

1. After login, verify dashboard loads
2. Test log upload/paste functionality
3. Check all UI elements render correctly

---

## 🎉 You're Live!

Your LogLens instance is now running in production!

---

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Authentication flow works end-to-end
- [ ] Dashboard is accessible after login
- [ ] No console errors in browser
- [ ] HTTPS is enforced
- [ ] Custom domain configured (if applicable)
- [ ] WorkOS redirect URI matches deployment URL

---

## Troubleshooting

### "Authentication Error" or "Invalid Redirect URI"

**Solution**: Verify `WORKOS_REDIRECT_URI` in Vercel matches the redirect URI in WorkOS Dashboard.

```bash
# Vercel Environment Variable
WORKOS_REDIRECT_URI=https://yourdomain.com/api/auth/callback

# WorkOS Dashboard → Redirects
https://yourdomain.com/api/auth/callback
```

### Build Fails with TypeScript Errors

**Solution**: Check build logs in Vercel. Fix TypeScript errors locally and push to GitHub.

```bash
# Test build locally
npm run build

# Fix errors, then commit and push
git add .
git commit -m "Fix TypeScript errors"
git push
```

### "Environment Variable Not Found"

**Solution**: Ensure all required environment variables are set in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Verify all variables are present
3. Click **Redeploy** after adding variables

---

## Next Steps

### Recommended Enhancements

1. **Add Error Tracking**:
   - Sign up for [Sentry](https://sentry.io/)
   - Add Sentry SDK to project
   - Monitor production errors

2. **Enable Analytics**:
   - Vercel Analytics is automatically enabled
   - View analytics in Vercel dashboard

3. **Set Up Monitoring**:
   - Use [Pingdom](https://www.pingdom.com/) or [UptimeRobot](https://uptimerobot.com/)
   - Monitor uptime and performance
   - Set up alerts

4. **Configure Alerts**:
   - Vercel → **Settings** → **Notifications**
   - Enable deployment notifications
   - Enable error alerts

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **WorkOS Docs**: https://workos.com/docs
- **LogLens Docs**: See `DEPLOYMENT_CHECKLIST.md`

---

**Deployment Time**: ~10 minutes  
**Difficulty**: Easy  
**Cost**: Free (Vercel Hobby + WorkOS Free Tier)
