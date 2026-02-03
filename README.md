# LogLens 🚀

**Enterprise-grade log analytics and visualization platform.**

LogLens transforms raw logs into actionable insights using modern web technologies and a high-performance architecture. Built with Next.js, TypeScript, and WorkOS AuthKit.

## 📋 Table of Contents
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Development Workflow](#-development-workflow)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- ⚡ **Real-time Log Frequency Analysis** - Visualize log volume trends instantly.
- 🤖 **AI-Powered Insights** - Integrated overview cards with smart log interpretation.
- 🔒 **Enterprise Authentication** - Secure login powered by WorkOS AuthKit.
- 🎨 **Premium Modern UI** - Sleek, dark-themed dashboard with smooth Framer Motion animations.
- 📈 **Interactive Dashboards** - Rich data visualizations using Recharts.

## 🏗️ Project Structure
```bash
loglens/
├── frontend/          # Next.js frontend application (App Router)
├── backend/           # Node.js/Express backend API (Internal/Future)
├── shared/            # Shared TypeScript types and utilities
├── docs/              # Structured project documentation
└── scripts/           # Build and security automation scripts
```

## 🚀 Quick Start
### Prerequisites
- Node.js >= 20.x
- npm or pnpm
- [WorkOS Environment Keys](https://workos.com/)

### Installation
```bash
# Clone the repository
git clone https://github.com/Keerthanreddy01/Loglens.git
cd Loglens

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📚 Documentation
- [Architecture Overview](./docs/architecture/landing-page-ui.md)
- [Authentication Workflow](./docs/guides/auth-testing.md)
- [Refactoring Roadmap](./docs/guides/roadmap.md)
- [Development Quickstart](./docs/guides/quickstart.md)

## 🛠️ Development Workflow
We follow the **Standard Feature Flow**:
1. Branch from `develop`.
2. Implement feature in `frontend/src/features/`.
3. Verify with local testing.
4. Merge to `develop` and eventually `main`.

## 🛡️ Security
Security is our priority. We use:
- **Environment Isolation**: Secrets are never committed to Git.
- **Pre-push Hooks**: Automated scans for secrets and linting.
- **CSRF & CSP**: Industry-standard protection headers.

## 🤝 Contributing
Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  Made with ❤️ by the LogLens Team
</div>
