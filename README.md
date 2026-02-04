# LogLens 🔍

**Enterprise-grade log analytics and visualization platform for modern infrastructure teams.**

LogLens transforms raw logs into actionable insights with real-time analysis, AI-powered intelligence, and a premium, cinematic user interface. Built with Next.js 16, TypeScript, and WorkOS AuthKit.

---

## ✨ Features

- ⚡ **Real-Time Log Analysis** - Parse and visualize log streams instantly with sub-second latency
- 🤖 **AI-Powered Insights** - Intelligent log interpretation and anomaly detection
- 🔒 **Enterprise Authentication** - Secure, scalable auth powered by WorkOS AuthKit
- 🎨 **Premium Modern UI** - 2026-grade dark theme with smooth animations and glassmorphic design
- 📈 **Interactive Dashboards** - Rich data visualizations with Recharts
- 🔍 **Advanced Filtering** - Smart filters, saved queries, and full-text search
- 📊 **Performance Metrics** - Error velocity tracking, service health monitoring
- 🎯 **Context Inspector** - Deep-dive into individual log entries with metadata exploration

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Authentication** | WorkOS AuthKit |
| **UI Components** | Radix UI |
| **Animations** | Framer Motion, GSAP |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.x
- **npm** or **pnpm**
- **WorkOS Account** - [Sign up here](https://workos.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Keerthanreddy01/Loglens.git
cd Loglens

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local with your WorkOS credentials
# Get credentials from: https://dashboard.workos.com/
```

### Environment Configuration

Edit `.env.local` and add your WorkOS credentials:

```bash
WORKOS_CLIENT_ID=your_workos_client_id_here
WORKOS_API_KEY=your_workos_api_key_here
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
WORKOS_COOKIE_PASSWORD=generate_a_secure_32_character_password_here
```

**Generate a secure cookie password:**
```bash
openssl rand -base64 32
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
loglens/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages & API routes
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── middleware.ts  # Auth middleware
│   ├── public/            # Static assets
│   └── next.config.mjs    # Next.js configuration
│
├── backend/               # Future backend API (planned)
├── shared/                # Shared TypeScript types
├── docs/                  # Documentation
│   ├── architecture/      # Architecture docs
│   └── guides/            # How-to guides
│
├── .env.example           # Environment variable template
├── SECURITY.md            # Security documentation
├── DEPLOYMENT_CHECKLIST.md # Deployment guide
├── ARCHITECTURE.md        # System architecture
└── README.md              # This file
```

---

## 📚 Documentation

- **[Architecture Overview](./ARCHITECTURE.md)** - System design and data flow
- **[Security Policy](./SECURITY.md)** - Security best practices and reporting
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Testing (future)
npm run test:unit        # Run unit tests
npm run test:e2e         # Run end-to-end tests
```

### Development Workflow

1. **Create a feature branch** from `main`
2. **Implement your feature** with hot reload (`npm run dev`)
3. **Run type-check and lint** before committing
4. **Push to GitHub** - pre-push hooks will run security scans
5. **Create a Pull Request**
6. **Merge after review**

---

## 🚀 Deployment

### Recommended Platform: Vercel

LogLens is optimized for deployment on Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `WORKOS_CLIENT_ID`
   - `WORKOS_API_KEY`
   - `WORKOS_REDIRECT_URI` (e.g., `https://yourdomain.com/api/auth/callback`)
   - `WORKOS_COOKIE_PASSWORD`
   - `NODE_ENV=production`

3. **Deploy** - Vercel will automatically build and deploy

### Alternative Platforms

**Netlify**:
```bash
# Build command
npm run build

# Publish directory
.next
```

**Railway**:
- Connect GitHub repository
- Set environment variables
- Deploy automatically

**AWS/GCP**:
- See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed instructions

### Pre-Deployment Checklist

Before deploying to production, review:

- [ ] All environment variables are set
- [ ] `WORKOS_REDIRECT_URI` matches production domain
- [ ] No secrets are committed to Git
- [ ] Build passes without errors (`npm run build`)
- [ ] TypeScript compilation succeeds
- [ ] Security headers are configured

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete checklist.

---

## 🔐 Security

Security is our top priority. LogLens implements:

- **Environment Isolation** - Secrets never committed to Git
- **Pre-push Hooks** - Automated secret scanning and linting
- **HTTPS Enforcement** - All production traffic encrypted
- **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- **Session Security** - HTTP-only cookies, secure flags
- **Input Validation** - Zod schemas for all user input
- **CSRF Protection** - Built-in Next.js middleware

**Report security vulnerabilities**: See [SECURITY.md](./SECURITY.md)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for:

- Code of conduct
- Development setup
- Pull request process
- Coding standards

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [WorkOS](https://workos.com/) - Enterprise authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Chart library

Inspired by the design excellence of:
- [Linear](https://linear.app/)
- [Vercel](https://vercel.com/)
- [WorkOS](https://workos.com/)
- [Stripe](https://stripe.com/)

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Keerthanreddy01/Loglens/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Keerthanreddy01/Loglens/discussions)

---

<div align="center">
  <strong>Made with ❤️ by the LogLens Team</strong>
  <br />
  <sub>Transforming logs into intelligence since 2026</sub>
</div>
