# Week 1 Quick Start Guide

## 🚀 Getting Started with Refactoring

**Duration**: Week 1-2 (Planning & Setup)  
**Goal**: Prepare infrastructure and create project structure

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 20+ installed
- [ ] Git configured
- [ ] Code editor ready (VS Code recommended)
- [ ] Terminal/command line access
- [ ] Current application working (authentication verified ✅)

---

## 📋 Week 1 Tasks

### Day 1-2: Project Structure Setup

#### Task 1: Create Directory Structure
```bash
# Navigate to your project root
cd c:\Users\keert\Desktop\Website

# Create new directories
mkdir frontend backend shared

# Create subdirectories for backend
mkdir backend\src
mkdir backend\src\config
mkdir backend\src\routes
mkdir backend\src\controllers
mkdir backend\src\middleware
mkdir backend\src\services
mkdir backend\src\utils
mkdir backend\src\types
mkdir backend\tests

# Create subdirectories for frontend (we'll move existing files here)
mkdir frontend\src
```

#### Task 2: Initialize Backend Project
```bash
cd backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express cors helmet compression cookie-parser dotenv

# Install WorkOS
npm install @workos-inc/node

# Install utilities
npm install zod winston express-rate-limit

# Install dev dependencies
npm install -D typescript @types/express @types/node @types/cors @types/cookie-parser ts-node nodemon @types/compression

# Install testing dependencies
npm install -D jest @types/jest ts-jest supertest @types/supertest

# Initialize TypeScript
npx tsc --init
```

#### Task 3: Configure Backend TypeScript
Create `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### Task 4: Create Backend Package Scripts
Update `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts"
  }
}
```

---

### Day 3-4: Backend Core Setup

#### Task 5: Create Environment Configuration
Create `backend/.env.example`:
```env
# Server
NODE_ENV=development
PORT=3001

# WorkOS
WORKOS_API_KEY=your_api_key_here
WORKOS_CLIENT_ID=your_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3001/api/auth/callback

# Frontend
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

# Session
SESSION_SECRET=your-super-secret-session-key-change-this
COOKIE_PASSWORD=your-32-character-cookie-password

# Logging
LOG_LEVEL=info
```

Create `backend/.env`:
```env
# Copy from your existing .env.local
NODE_ENV=development
PORT=3001

WORKOS_API_KEY=your_workos_api_key_here
WORKOS_CLIENT_ID=your_workos_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3001/api/auth/callback

FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

SESSION_SECRET=generate_a_secure_random_32_char_secret
COOKIE_PASSWORD=generate_a_secure_random_32_char_password

LOG_LEVEL=info
```

#### Task 6: Create Basic Server Files

**File: `backend/src/server.ts`**
```typescript
import { App } from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

const app = new App();

app.listen(Number(PORT));

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
```

**File: `backend/src/app.ts`**
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './utils/logger';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(corsMiddleware);
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`🚀 Backend server running on port ${port}`);
    });
  }
}
```

---

### Day 5: Frontend Preparation

#### Task 7: Prepare Frontend Migration
```bash
# We'll keep the existing Next.js app for now
# In Week 5, we'll move it to frontend/ directory

# For now, just document what needs to be moved:
# - app/ directory
# - components/ directory
# - lib/ directory
# - public/ directory
# - styles/ directory
# - All config files (next.config.js, tailwind.config.js, etc.)
```

#### Task 8: Create API Client Placeholder
Create `lib/api/client.ts` in your current project:
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We'll add interceptors in Week 5
```

---

## 📝 Documentation Tasks

### Task 9: Document Current API Endpoints

Create `API_INVENTORY.md`:
```markdown
# Current API Endpoints

## Authentication
- GET /api/auth/login - Initiate WorkOS login
- GET /api/auth/callback - OAuth callback
- POST /api/auth/logout - Logout user

## Dashboard
- (Document any dashboard data endpoints)

## User
- (Document any user-related endpoints)
```

### Task 10: Create Development Setup Guide

Create `DEVELOPMENT_SETUP.md`:
```markdown
# Development Setup

## Prerequisites
- Node.js 20+
- npm or pnpm

## Running the Application

### Current Monolith (Temporary)
```bash
npm run dev
# Runs on http://localhost:3000
```

### New Backend (Once set up)
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### Future Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```
```

---

## ✅ Week 1 Checklist

- [ ] Created `frontend/`, `backend/`, `shared/` directories
- [ ] Initialized backend project with npm
- [ ] Installed backend dependencies
- [ ] Configured TypeScript for backend
- [ ] Created environment variable files
- [ ] Created basic server files (`app.ts`, `server.ts`)
- [ ] Tested backend server runs (`npm run dev` in backend/)
- [ ] Documented current API endpoints
- [ ] Created development setup guide
- [ ] Reviewed refactoring roadmap

---

## 🧪 Testing Week 1 Setup

### Test Backend Server
```bash
cd backend
npm run dev

# Should see:
# 🚀 Backend server running on port 3001

# Test health endpoint:
# Open browser to http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🚨 Common Issues

### Issue: Port 3001 already in use
**Solution**: 
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in backend/.env
```

### Issue: TypeScript errors
**Solution**: Ensure all @types packages are installed

### Issue: Module not found
**Solution**: Run `npm install` in backend directory

---

## 📞 Need Help?

If you encounter issues:
1. Check error messages carefully
2. Verify all dependencies installed
3. Ensure environment variables are set
4. Check file paths are correct
5. Ask for assistance!

---

## 🎯 Week 1 Success Criteria

By end of Week 1, you should have:
- ✅ Project structure created
- ✅ Backend project initialized
- ✅ Basic Express server running
- ✅ Health check endpoint working
- ✅ Documentation started
- ✅ Ready to begin Week 2 (authentication migration)

---

## 📅 Next Week Preview

**Week 2 Tasks**:
- Migrate WorkOS authentication to backend
- Create auth routes and controllers
- Implement auth middleware
- Test authentication flow with backend

---

**Ready to start?** Let me know when you want to begin Week 1 tasks!
