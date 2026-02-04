# LogLens Deployment & Repository Guidelines 🚀

These guidelines ensure the repository remains in a "Correct" state for automated Vercel deployments and production security.

## 1. Repository Structure (Flat Model)
The project has been refactored from a monorepo to a flat Next.js structure. 
- **DO NOT** use the old `frontend/` or `shared/` directories.
- **DO NOT** use legacy path aliases like `@/features/*` or `@/lib/store`.
- Use standard paths:
  - `@/components/ui/*` for shared UI elements.
  - `@/components/logs/*` for log-related features.
  - `@/store/*` for state management.
  - `@/lib/*` for shared logic.

## 2. Before You Push (The Checklist)
Before pushing to `main`, ensure the following:
1. **Local Build**: Run `npm run build` and ensure it exits with `0` errors.
2. **Path Aliases**: Ensure zero usage of legacy path aliases.
3. **Environment Secrets**: Ensure `.env.local` is never committed.
4. **Security Hook**: Run `./scripts/pre-push-check.sh` manually if needed.

## 3. Automated Deployment
Pushes to the `main` branch trigger an automatic build on Vercel. 
- **Trigger Commit**: All "Module not found" errors have been resolved by moving to explicit folder imports.
- **Experimental Flags**: Disabled `optimizeCss` in `next.config.mjs` for build stability.

## 4. Environment Variables
The following keys **must** be set in the Vercel Dashboard for the app to function:
- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_REDIRECT_URI` (Points to production domain)
- `WORKOS_COOKIE_PASSWORD` (32+ character secure string)
- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV=production`

---
*Maintained by the LogLens Engineering Team (2026)*