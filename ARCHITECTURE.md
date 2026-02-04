# LogLens Architecture

## System Overview

LogLens is a modern, enterprise-grade log analytics and visualization platform built with Next.js 16, TypeScript, and WorkOS AuthKit. The application follows a monorepo structure with clear separation between frontend, backend, and shared utilities.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Landing   │  │ Dashboard  │  │   Auth     │            │
│  │   Page     │  │    UI      │  │   Flow     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App Router (src/app)                                  │ │
│  │  - Server Components (default)                         │ │
│  │  - Client Components (interactive UI)                  │ │
│  │  - API Routes (/api/*)                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware (src/middleware.ts)                        │ │
│  │  - WorkOS AuthKit Integration                          │ │
│  │  - Route Protection                                    │ │
│  │  - Session Management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  State Management (Zustand)                            │ │
│  │  - Log Store (src/lib/store.ts)                        │ │
│  │  - Client-side state                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   WorkOS     │  │   Vercel     │  │   Future     │      │
│  │  AuthKit     │  │  Analytics   │  │   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
loglens/
├── frontend/                    # Next.js 16 application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Landing page (public)
│   │   │   ├── LandingClient.tsx # Client-side landing logic
│   │   │   ├── dashboard/       # Protected dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── api/             # API routes
│   │   │   │   └── auth/        # WorkOS auth endpoints
│   │   │   └── globals.css      # Global styles
│   │   │
│   │   ├── components/          # React components
│   │   │   ├── features/        # Feature-specific components
│   │   │   │   └── dashboard/   # Dashboard components
│   │   │   ├── layouts/         # Layout components
│   │   │   │   ├── app-shell.tsx
│   │   │   │   ├── top-nav.tsx
│   │   │   │   ├── left-sidebar.tsx
│   │   │   │   ├── right-panel.tsx
│   │   │   │   └── secondary-nav.tsx
│   │   │   ├── shared/          # Shared components
│   │   │   └── ui/              # Radix UI components
│   │   │
│   │   ├── lib/                 # Utilities and core logic
│   │   │   ├── store.ts         # Zustand state management
│   │   │   ├── log-parser.ts    # Log parsing logic
│   │   │   └── utils.ts         # Helper functions
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── use-notifications.ts
│   │   │   └── use-keyboard-shortcuts.ts
│   │   │
│   │   └── middleware.ts        # Next.js middleware (auth)
│   │
│   ├── public/                  # Static assets
│   ├── next.config.mjs          # Next.js configuration
│   ├── tailwind.config.ts       # Tailwind CSS config
│   └── package.json
│
├── backend/                     # Future backend API (Node.js/Express)
│   ├── src/
│   │   ├── api/                 # API routes
│   │   ├── services/            # Business logic
│   │   └── models/              # Data models
│   └── package.json
│
├── shared/                      # Shared TypeScript types
│   └── types/
│
├── docs/                        # Documentation
│   ├── architecture/
│   └── guides/
│
├── scripts/                     # Build and automation scripts
│   └── pre-push-check.sh
│
├── .env.example                 # Environment variable template
├── SECURITY.md                  # Security documentation
├── DEPLOYMENT_CHECKLIST.md      # Deployment guide
└── README.md                    # Project overview
```

---

## 🔐 Authentication Flow

LogLens uses **WorkOS AuthKit** for enterprise-grade authentication.

### Authentication Architecture

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ 1. Visits /dashboard
       ▼
┌──────────────────────────────────┐
│  Next.js Middleware              │
│  (src/middleware.ts)             │
│  - Checks for auth session       │
│  - Validates cookie              │
└──────┬───────────────────────────┘
       │
       │ 2. No session found
       ▼
┌──────────────────────────────────┐
│  Redirect to /api/auth/login     │
└──────┬───────────────────────────┘
       │
       │ 3. Redirect to WorkOS
       ▼
┌──────────────────────────────────┐
│  WorkOS AuthKit                  │
│  - User enters credentials       │
│  - MFA (if enabled)              │
│  - SSO (if configured)           │
└──────┬───────────────────────────┘
       │
       │ 4. Auth code returned
       ▼
┌──────────────────────────────────┐
│  /api/auth/callback              │
│  - Exchange code for session     │
│  - Set secure HTTP-only cookie   │
└──────┬───────────────────────────┘
       │
       │ 5. Redirect to /dashboard
       ▼
┌──────────────────────────────────┐
│  Dashboard (Protected Route)     │
│  - Session validated             │
│  - User data available           │
└──────────────────────────────────┘
```

### Session Management

- **Storage**: Secure HTTP-only cookies
- **Expiration**: Configurable via WorkOS (default: 7 days)
- **Refresh**: Automatic via WorkOS SDK
- **Logout**: Clears session and redirects to landing page

### Protected Routes

Routes requiring authentication:
- `/dashboard` - Main application
- `/api/*` - API routes (except `/api/auth/*`)

Public routes:
- `/` - Landing page
- `/api/auth/login` - Login endpoint
- `/api/auth/callback` - OAuth callback
- `/api/auth/logout` - Logout endpoint

---

## 📊 Data Flow

### Log Processing Pipeline

```
┌─────────────────┐
│  User Action    │
│  - Paste logs   │
│  - Upload file  │
│  - Load sample  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Log Parser (lib/log-parser.ts) │
│  - Parse raw log lines          │
│  - Extract metadata             │
│  - Detect log level             │
│  - Identify service             │
│  - Extract timestamps           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Zustand Store (lib/store.ts)   │
│  - Store parsed logs            │
│  - Calculate statistics         │
│  - Apply filters                │
│  - Manage UI state              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  React Components               │
│  - Log table (virtualized)      │
│  - Charts (Recharts)            │
│  - Filters and search           │
│  - Detail panels                │
└─────────────────────────────────┘
```

### State Management (Zustand)

**Store Structure** (`src/lib/store.ts`):

```typescript
interface LogStore {
  // Log data
  parsedLogs: ParsedLog[]
  comparisonLogs: ParsedLog[]
  selectedLogId: string | null
  
  // UI state
  activeTab: 'overview' | 'live-logs' | 'analytics' | 'alerts'
  isDetailsPanelOpen: boolean
  isFocusMode: boolean
  
  // Filters
  filter: LogFilter
  smartFilters: SmartFilters
  
  // Statistics
  stats: LogStats
  
  // Saved queries
  savedQueries: SavedQuery[]
  alertRules: AlertRule[]
  
  // Actions
  addLogs: (logs: ParsedLog[]) => void
  clearLogs: () => void
  selectLog: (id: string) => void
  updateFilter: (filter: Partial<LogFilter>) => void
  // ... more actions
}
```

---

## 🎨 UI Architecture

### Component Hierarchy

```
AppShell
├── TopNav (floating, premium navigation)
│   ├── Logo
│   ├── Global Search
│   ├── Notifications
│   └── User Menu
│
├── SecondaryNav (floating pill bar)
│   └── Tab Switcher (Overview, Intelligence, Analytics, Alerts)
│
├── LeftSidebar
│   ├── Telemetry Cards (Error Velocity, Logs, Services)
│   ├── Intelligence Filters (All Traffic, Critical Path, etc.)
│   └── Saved Views
│
├── Main Content Area
│   ├── EmptyState (when no logs)
│   │   ├── AI Indicator
│   │   ├── Hero Typography
│   │   └── Action Cards (Paste, Upload, Sample)
│   │
│   └── Dashboard (when logs exist)
│       ├── Log Table (virtualized with @tanstack/react-virtual)
│       ├── Charts (Recharts)
│       └── Analytics Views
│
└── RightPanel (Context Inspector)
    ├── Log Details
    ├── Metadata
    ├── Related Logs
    └── Quick Actions
```

### Design System

**Visual Language**:
- **Background**: Near-black (`#050507`) with noise overlay
- **Surfaces**: Glassmorphic cards with `backdrop-blur-xl`
- **Borders**: Subtle white/[0.04-0.08] for depth
- **Typography**: Editorial-style with tight tracking
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React

**Color Palette**:
- **Primary**: Purple/Indigo (`#8B5CF6`)
- **Success**: Green (`#10B981`)
- **Warning**: Orange (`#F59E0B`)
- **Destructive**: Red (`#EF4444`)
- **Muted**: Zinc shades

---

## 🔌 External Integrations

### WorkOS AuthKit

**Purpose**: Enterprise authentication and user management

**Integration Points**:
- `src/middleware.ts` - Route protection
- `/api/auth/*` - Auth endpoints (auto-generated by WorkOS SDK)
- Environment variables: `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`

**Features Used**:
- Email/password authentication
- OAuth (Google, Microsoft, etc.)
- Session management
- User profile data

### Vercel Analytics (Optional)

**Purpose**: Performance and usage analytics

**Integration**:
- `@vercel/analytics` package
- Automatic pageview tracking
- Web Vitals monitoring

---

## 🚀 Deployment Architecture

### Recommended Platform: Vercel

**Why Vercel**:
- Native Next.js support
- Automatic HTTPS
- Edge network (CDN)
- Zero-config deployments
- Preview deployments for PRs

**Build Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Environment Variables** (set in Vercel dashboard):
- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_REDIRECT_URI` (e.g., `https://loglens.app/api/auth/callback`)
- `WORKOS_COOKIE_PASSWORD`
- `NODE_ENV=production`

### Alternative Platforms

**Netlify**:
- Build command: `npm run build`
- Publish directory: `.next`
- Requires `netlify.toml` for redirects

**Railway**:
- Automatic deployment from GitHub
- Environment variables via dashboard
- Custom domain support

**AWS (Amplify/ECS)**:
- More complex setup
- Requires IAM configuration
- Use AWS Secrets Manager for environment variables

---

## 📈 Observability Strategy

### Current Implementation

**Client-Side**:
- React error boundaries
- Toast notifications (Sonner)
- Browser console (development only)

**Future Enhancements**:

1. **Error Tracking**:
   - Sentry for frontend errors
   - LogRocket for session replay
   - Custom error reporting API

2. **Performance Monitoring**:
   - Vercel Analytics (Web Vitals)
   - Custom performance metrics
   - Real User Monitoring (RUM)

3. **Logging**:
   - Structured logging to external service
   - Log aggregation (Datadog, New Relic)
   - Audit trails for user actions

4. **Alerting**:
   - Error rate thresholds
   - Performance degradation alerts
   - Uptime monitoring (Pingdom, UptimeRobot)

---

## 🔒 Security Architecture

### Defense in Depth

**Layer 1: Network**
- HTTPS enforced
- HSTS headers
- Secure cookie flags

**Layer 2: Application**
- WorkOS AuthKit (enterprise-grade)
- CSRF protection (Next.js middleware)
- Input validation (Zod schemas)

**Layer 3: Data**
- No sensitive data in client bundles
- Environment variables for secrets
- Secure session storage (HTTP-only cookies)

**Layer 4: Code**
- TypeScript for type safety
- ESLint for code quality
- Pre-push hooks for secret scanning

### Threat Model

**Mitigated Threats**:
- ✅ XSS (React escaping, CSP headers)
- ✅ CSRF (SameSite cookies, middleware)
- ✅ Session hijacking (Secure cookies, HTTPS)
- ✅ Injection attacks (Input validation)

**Future Considerations**:
- Rate limiting on API routes
- DDoS protection (Cloudflare, Vercel)
- Advanced bot detection

---

## 🧪 Testing Strategy

### Current State
- Manual testing
- TypeScript type checking
- ESLint static analysis

### Recommended Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (Playwright, Cypress)
        │   (Few)     │  - Critical user flows
        └─────────────┘  - Auth, log upload, dashboard
              │
        ┌─────────────┐
        │ Integration │  (React Testing Library)
        │   Tests     │  - Component interactions
        │  (Some)     │  - Store updates
        └─────────────┘  - API routes
              │
        ┌─────────────┐
        │ Unit Tests  │  (Jest, Vitest)
        │   (Many)    │  - Utility functions
        │             │  - Log parser
        └─────────────┘  - Validators
```

---

## 📦 Build & Deployment Process

### Development Workflow

```
1. Developer creates feature branch
   ↓
2. Implements feature with hot reload (npm run dev)
   ↓
3. Runs type-check and lint (pre-commit hooks)
   ↓
4. Pushes to GitHub
   ↓
5. Pre-push hook runs secret scan
   ↓
6. GitHub Actions (future): Run tests, build
   ↓
7. Merge to main
   ↓
8. Vercel auto-deploys to production
```

### Production Build

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Output: .next/ directory (optimized, minified)
```

---

## 🔮 Future Architecture Enhancements

### Backend API (Planned)

**Purpose**: Offload heavy processing, add persistence

**Tech Stack**:
- Node.js + Express (or Fastify)
- PostgreSQL (Supabase) for data storage
- Redis for caching
- Bull for job queues

**Endpoints**:
- `POST /api/logs/ingest` - Receive logs from clients
- `GET /api/logs/query` - Query stored logs
- `POST /api/alerts/create` - Create alert rules
- `GET /api/analytics/summary` - Aggregated analytics

### Real-Time Features

**WebSocket Integration**:
- Live log streaming
- Collaborative filtering
- Real-time alerts

**Tech**: Socket.io or Pusher

### AI/ML Integration

**Features**:
- Anomaly detection
- Log clustering
- Predictive alerts
- Natural language queries

**Tech**: OpenAI API, TensorFlow.js

---

## 📚 Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 16.0.10 |
| React | UI library | 19.2.0 |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 4.1.9 |
| Zustand | State management | 5.0.11 |
| WorkOS AuthKit | Authentication | 2.13.0 |
| Framer Motion | Animations | 12.29.2 |
| Recharts | Data visualization | 2.15.4 |
| Radix UI | Component primitives | Various |
| Lucide React | Icons | 0.454.0 |

---

## 🤝 Contributing to Architecture

When proposing architectural changes:

1. **Document the problem** - What are we solving?
2. **Propose solutions** - Consider multiple approaches
3. **Evaluate trade-offs** - Performance, complexity, maintainability
4. **Update this document** - Keep architecture docs current
5. **Get team buy-in** - Discuss in team meetings or RFCs

---

**Last Updated**: February 2026  
**Maintained By**: LogLens Engineering Team
