# Railway Deployment Guide for SaaS Application

## 🚀 Deploy Your SaaS Application to Railway

Railway is a modern deployment platform that's perfect for full-stack applications. It offers:
- **$5/month free credit** (enough for development)
- **Automatic deployments** from GitHub
- **Built-in PostgreSQL** database
- **Custom domains** and SSL
- **Zero configuration** needed

## 🎯 Railway Architecture

Your SaaS application will be deployed as:
- **Backend Service**: Node.js API (automatically detected)
- **Frontend Service**: React app (static site)
- **Database**: PostgreSQL (managed by Railway)

## 📋 Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to **[Railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Sign up with your **GitHub account** (same as your repo)
4. Verify your account

## 🚀 **IMPORTANT: Railway Deployment Strategy**

Due to Railway's Nixpacks detection issues with monorepos, we'll deploy each service separately by specifying the **Root Directory** for each service.

### Step 2: Deploy Backend Service

1. **Create New Project**:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose: `Mohamedriyas2411/saas-app`

2. **Configure Backend Service**:
   - **Service Name**: `saas-backend`
   - Go to **Settings** → **Service** → **Root Directory**: `backend`
   - **Build Command**: Leave empty (auto-detected)
   - **Start Command**: Leave empty (auto-detected: `npm start`)

3. **Environment Variables** (Variables tab):
   ```env
   NODE_ENV=production
   JWT_SECRET=your-super-secret-railway-jwt-key-123456789
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   FRONTEND_URL=https://your-frontend-service.railway.app
   ```

**Critical**: The **Root Directory** setting tells Railway to only look at the `backend/` folder, avoiding monorepo confusion.

### Step 3: Add PostgreSQL Database

1. **Add Database**:
   - In your project, click **"+ New"**
   - Select **"Database"** → **"PostgreSQL"**
   - Railway will create and connect it automatically

2. **Database Connection**:
   - The `DATABASE_URL` is automatically available as `${{Postgres.DATABASE_URL}}`
   - No manual configuration needed!

### Step 4: Initialize Database Schema

1. **Connect to Database**:
   - Go to your PostgreSQL service
   - Click **"Connect"** → **"psql"**
   - Or use the connection string with any PostgreSQL client

2. **Run Schema Commands**:
   ```sql
   -- Create users table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create subscriptions table
   CREATE TABLE subscriptions (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       plan VARCHAR(50) NOT NULL DEFAULT 'free',
       status VARCHAR(50) NOT NULL DEFAULT 'active',
       trial_end_date TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Insert sample subscription plans
   INSERT INTO subscriptions (user_id, plan, status) VALUES 
   (NULL, 'basic', 'template'),
   (NULL, 'pro', 'template'),
   (NULL, 'enterprise', 'template');
   ```

### Step 5: Deploy Frontend Service

1. **Add Frontend Service**:
   - Click **"+ New"** in your project
   - Select **"GitHub Repo"** (same repo)
   - **Service Name**: `saas-frontend`

2. **Configure Frontend Build**:
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - **Install Command**: `npm install`

3. **Frontend Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-service.railway.app/api
   ```

**Important**: Set **Root Directory** to `frontend` so Railway only builds the React app!

### Step 6: Update CORS Settings

After deployment, update your backend CORS settings:

1. **Get Service URLs**:
   - Backend: `https://your-backend-service.railway.app`
   - Frontend: `https://your-frontend-service.railway.app`

2. **Update Backend Environment**:
   ```env
   FRONTEND_URL=https://your-frontend-service.railway.app
   ```

## 🛠 Railway Configuration Files

### Create `railway.toml` (optional but recommended):

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

### Backend `package.json` scripts (verify these exist):

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

### Frontend `package.json` scripts (verify these exist):

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port $PORT"
  }
}
```

## 🔧 Environment Variables Reference

### Backend Service Variables:
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-railway-jwt-key-123456789
PORT=${{PORT}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=https://your-frontend-service.railway.app
```

### Frontend Service Variables:
```env
VITE_API_URL=https://your-backend-service.railway.app/api
```

## 🚀 Deployment Process

1. **Push to GitHub** (already done ✅):
   ```bash
   git push origin main
   ```

2. **Railway Auto-Deploy**:
   - Railway watches your GitHub repo
   - Automatic deployments on every push to `main`
   - Build logs available in real-time

3. **Monitor Deployment**:
   - Check deployment status in Railway dashboard
   - View build and runtime logs
   - Test endpoints once deployed

## 🌐 Custom Domain (Optional)

1. **Add Domain**:
   - Go to service → **Settings** → **Domains**
   - Click **"Custom Domain"**
   - Enter your domain: `yoursaasapp.com`

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: www (or @)
   Value: your-service.railway.app
   ```

3. **SSL Certificate**:
   - Railway automatically provides SSL certificates
   - HTTPS enabled by default

## 💰 Railway Pricing

### Free Tier:
- **$5 free credit per month**
- **500 hours** of runtime
- **1GB RAM** per service
- **1GB storage** for databases

### Paid Plans:
- **$5/month** after free credit
- **8GB RAM** per service
- **Unlimited** runtime hours
- **100GB** database storage

## 🔍 Monitoring & Debugging

### Check Deployment Status:
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Login and check status
railway login
railway status
railway logs
```

## 🛠 Troubleshooting Railway Deployment Issues

### Issue 1: "Nixpacks build failed" or "Failed to parse Nixpacks config file"

**Solution**: 
1. **Remove any nixpacks.toml files** from your repo
2. **Set Root Directory** correctly in Railway service settings:
   - Backend service: Root Directory = `backend`
   - Frontend service: Root Directory = `frontend`
3. Let Railway auto-detect the build process

### Issue 2: "No package.json found" or build detection issues

**Solution**:
1. Verify **Root Directory** is set correctly
2. Check that `package.json` exists in the specified directory
3. Make sure your `package.json` has correct scripts:
   - Backend: `"start": "node src/app.js"`
   - Frontend: `"build": "vite build"`, `"preview": "vite preview"`

### Issue 3: Database connection errors

**Solution**:
1. Add PostgreSQL service to your Railway project first
2. Use `${{Postgres.DATABASE_URL}}` in your environment variables
3. Make sure your backend uses `process.env.DATABASE_URL`

### Issue 4: CORS errors between frontend and backend

**Solution**:
1. Update backend CORS settings with frontend URL
2. Set `FRONTEND_URL` environment variable in backend service
3. Set `VITE_API_URL` environment variable in frontend service

## 🔄 Alternative: Fork Repository Approach

If you continue having issues with the monorepo structure:

1. **Create separate repositories**:
   - Fork/copy `backend/` to new repo: `saas-backend`
   - Fork/copy `frontend/` to new repo: `saas-frontend`

2. **Deploy each repository separately**:
   - Deploy `saas-backend` as a service
   - Deploy `saas-frontend` as a service

This eliminates monorepo complexity entirely.

## ✅ Deployment Checklist

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Environment variables prepared

### During Deployment:
- [ ] Backend service configured
- [ ] PostgreSQL database added
- [ ] Database schema initialized
- [ ] Frontend service configured
- [ ] Environment variables set

### After Deployment:
- [ ] Test user registration/login
- [ ] Verify API endpoints work
- [ ] Test subscription management
- [ ] Check responsive design
- [ ] Monitor performance

## 🚀 Quick Deploy Commands

```bash
# If you have Railway CLI installed
railway login
railway project create saas-app
railway add postgresql
railway up
```

## 🎯 Expected Timeline

- **Setup Railway Account**: 2 minutes
- **Deploy Backend**: 5-10 minutes
- **Add Database**: 2 minutes
- **Initialize Schema**: 5 minutes
- **Deploy Frontend**: 5-10 minutes
- **Testing & Configuration**: 10 minutes

**Total: ~30-40 minutes for complete deployment**

## 🌟 Benefits of Railway

✅ **Zero Configuration** - Automatic detection of your stack
✅ **GitHub Integration** - Automatic deployments
✅ **Managed Database** - PostgreSQL with automatic backups
✅ **Custom Domains** - Free SSL certificates
✅ **Monitoring** - Built-in metrics and logs
✅ **Scaling** - Easy horizontal scaling
✅ **Cost-Effective** - Great free tier, reasonable pricing

Your SaaS application will be live and accessible worldwide once deployed to Railway!

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app/
- **GitHub Repository**: https://github.com/Mohamedriyas2411/saas-app
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

Ready to deploy? Start with Step 1 and your SaaS application will be live in under an hour! 🚀