# Water Quality Treatment Software - Deployment Guide

A complete, step-by-step guide to deploy the water quality treatment software online for free using Fly.io and Vercel.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Deployment Options](#3-deployment-options)
   - [Option A: Vercel + Fly.io](#option-a-vercel--flyio)
   - [Option B: Render Full-Stack](#option-b-render-full-stack)
   - [Option C: Supabase + External API](#option-c-supabase--external-api)
4. [Configuration Files](#4-configuration-files)
5. [Testing the Deployment](#5-testing-the-deployment)
6. [Troubleshooting](#6-troubleshooting)
7. [Production Checklist](#7-production-checklist)

---

## 1. Prerequisites

### Required Accounts
- **GitHub** - Source code hosting
- **Vercel** (or **Render**) - Frontend hosting
- **Fly.io** (or **Render**) - Backend hosting

### Local Tools
- **Node.js** v18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Git** - Version control
- **npm** - Package manager

### Verify Your Setup
```bash
# Check versions
node --version    # Should be 18.x or higher
npm --version     # Should be 8.x or higher
python --version  # Should be 3.11+
git --version     # Should be 2.x or higher

# Verify Python packages
python -c "import fastapi; print('FastAPI OK')"
python -c "import uvicorn; print('Uvicorn OK')"
```

---

## 2. Local Development Setup

### Clone and Prepare the Repository
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/water-plant-project.git
cd water-plant-project

# Backend setup
cd src
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Test Locally
```bash
# Terminal 1: Start backend
cd src
uvicorn main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev

# Open in browser: http://localhost:5173
# The frontend proxy (vite.config.js) forwards /api/* to localhost:8000
```

---

## 3. Deployment Options

### Option A: Vercel + Fly.io (Recommended)

#### Step 1: Deploy Frontend to Vercel
1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **New Project**
4. Import your GitHub repository
5. Vercel auto-detects the framework (Vite + React)
6. Verify settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. Click **Deploy**
8. Note the generated URL (e.g., `https://water-quality-app.vercel.app`)

#### Step 2: Deploy Backend to Fly.io
1. Install Fly CLI
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. Login to Fly.io
   ```bash
   fly auth login
   ```

3. Initialize the app
   ```bash
   cd src
   fly launch
   ```
   - App name: `water-quality-api` (or your preference)
   - Region: Choose closest (e.g., `fra` for Europe, `iad` for US)
   - **Deploy now**: No (we'll customize first)

4. Create `requirements.txt` if not present
   ```bash
   pip freeze > requirements.txt
   ```

5. Configure Fly.toml (auto-generated)
   ```toml
   app = "water-quality-api"

   [build]
     builder = "paketobuildpacks/builder:base"

   [env]
     PORT = "8080"

   [[services]]
     internal_port = 8080
     protocol = "tcp"

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443
   ```

6. Deploy
   ```bash
   fly deploy
   ```

7. Note the generated URL (e.g., `https://water-quality-api.fly.dev`)

#### Step 3: Configure CORS
Add this to `src/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://water-quality-app.vercel.app",  # Your Vercel URL
        "http://localhost:5173"  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy to Fly.io:
```bash
fly deploy
```

---

### Option B: Render Full-Stack

#### Step 1: Create Render Account
Go to [Render Dashboard](https://dashboard.render.com) and sign up.

#### Step 2: Deploy Frontend
1. Click **New** → **Static Site**
2. Select your GitHub repository
3. Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Click **Create Static Site**

#### Step 3: Deploy Backend
1. Click **New** → **Web Service**
2. Select same repository
3. Settings:
   - **Environment**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `src`
4. Click **Create Web Service**

#### Step 4: Configure CORS
Same CORS configuration as Option A, but use your Render domain instead.

---

### Option C: Supabase + External API

> ⚠️ **Note**: This option requires significant refactoring. Recommended only if you need Supabase's built-in auth, realtime features, or PostgreSQL-specific capabilities.

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up database tables for storing calculation history
3. Deploy API separately (Fly.io or Render)
4. Configure API keys in Supabase Edge Functions

---

## 4. Configuration Files

### Vercel Configuration (`vercel.json`) - Optional
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://water-quality-api.fly.dev/api/$1"
    }
  ]
}
```

### Fly.toml (in `src/`)
```toml
app = "water-quality-api"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

[[services.ports]]
  handlers = ["http"]
  port = 80

[[services.ports]]
  handlers = ["tls", "http"]
  port = 443
```

### requirements.txt (in `src/`)
```
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
jinja2>=3.1.0
pandas>=2.0.0
weasyprint>=60.0.0
xlsxwriter>=3.2.0
```

---

## 5. Testing the Deployment

### Verify Backend Health
```bash
curl https://your-api-url.fly.dev/health
# Expected: {"status":"healthy","version":"1.0.0"}
```

### Test Calculation Endpoint
```bash
curl -X POST https://your-api-url.fly.dev/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "turbidity": 85.2,
    "iron": 0.15,
    "manganese": 0.08,
    "ph": 6.8,
    "ammonia": 1.2,
    "color": 35.5
  }'
```

### Test Frontend
Open your Vercel URL in a browser:
1. Enter sample values
2. Click "Calculate Dosages"
3. Verify results display correctly
4. Click "Export PDF" / "Export Excel"
5. Verify files download successfully

---

## 6. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **CORS errors** | Verify `allow_origins` includes your Vercel/Render URL |
| **Build fails on Vercel** | Check that `npm install` completes; verify Node version |
| **Backend not responding** | Check Fly.io logs: `fly logs` |
| **Import errors** | Ensure `requirements.txt` has all dependencies |
| **Static files not found** | Create empty `frontend/static/` directory |
| **Port binding issues** | Use `$PORT` environment variable on Render/Fly |

### View Logs
```bash
# Fly.io logs
fly logs

# Render logs
# View in Render dashboard → Service → Logs

# Vercel logs
# View in Vercel dashboard → Project → Deployments → Logs
```

---

## 7. Production Checklist

- [ ] Code pushed to GitHub repository
- [ ] Frontend deployed to Vercel/Render
- [ ] Backend deployed to Fly.io/Render
- [ ] CORS configured correctly
- [ ] Health endpoint responding
- [ ] Calculate endpoint working
- [ ] Export buttons functional
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (HTTPS)
- [ ] Monitoring set up (UptimeRobot recommended)
- [ ] README.md updated with live URLs

---

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@waterquality.app

---

## 🎉 Deployment Complete!

Your water quality treatment software is now live and ready for investor presentations!