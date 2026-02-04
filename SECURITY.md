# Security Policy

## Reporting Security Vulnerabilities

We take the security of LogLens seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure Process

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via:
- **Email**: security@loglens.dev (or your team email)
- **GitHub Security Advisories**: https://github.com/Keerthanreddy01/Loglens/security/advisories/new

### What to Include in Your Report

Please provide:
1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if available)
5. **Your contact information** for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (critical issues within 24-48 hours)

---

## Security Best Practices

### 🔐 Environment Variables & Secrets

#### Production Requirements
- **NEVER** commit `.env`, `.env.local`, or `.env.production` files to Git
- Use separate WorkOS projects for development, staging, and production
- Rotate API keys immediately if exposed
- Use platform-specific secret management:
  - **Vercel**: Environment Variables in Project Settings
  - **AWS**: AWS Secrets Manager or Systems Manager Parameter Store
  - **GCP**: Secret Manager
  - **Azure**: Key Vault

#### Cookie Security
- `WORKOS_COOKIE_PASSWORD` must be at least 32 characters
- Generate secure passwords: `openssl rand -base64 32`
- Use different cookie passwords for each environment

### 🛡️ Authentication & Authorization

LogLens uses **WorkOS AuthKit** for enterprise-grade authentication:

#### Security Features Enabled
- ✅ Session-based authentication with secure HTTP-only cookies
- ✅ CSRF protection via middleware
- ✅ Automatic session expiration
- ✅ Secure redirect URI validation

#### Production Checklist
- [ ] Enable MFA in WorkOS dashboard for production environment
- [ ] Configure allowed redirect URIs in WorkOS
- [ ] Use HTTPS for all production deployments
- [ ] Enable WorkOS audit logs
- [ ] Review WorkOS security settings regularly

### 🌐 Network Security

#### HTTPS Requirements
- **Production MUST use HTTPS** - Never deploy over HTTP
- Configure proper SSL/TLS certificates
- Enable HSTS (HTTP Strict Transport Security)
- Use secure headers (see `next.config.mjs`)

#### CORS & CSP
- Content Security Policy headers are configured in Next.js
- CORS is restricted to known origins
- API routes validate request origins

### 📦 Dependency Security

#### Automated Scanning
- **Dependabot** is enabled for automatic dependency updates
- **npm audit** runs on pre-push hooks
- Regular security patches are applied

#### Manual Review Process
1. Review `npm audit` output before deployments
2. Update dependencies monthly
3. Test thoroughly after major version updates
4. Monitor GitHub Security Advisories

### 🔍 Code Security

#### Pre-commit Protections
- **Husky** pre-push hooks scan for:
  - Hardcoded secrets (API keys, passwords)
  - Console logs in production code
  - TypeScript errors
  - ESLint violations

#### Secure Coding Practices
- ✅ Input validation using Zod schemas
- ✅ XSS protection via React's built-in escaping
- ✅ SQL injection prevention (no raw queries)
- ✅ Rate limiting on API routes (future enhancement)

### 💾 Data Persistence & Privacy

#### Local Storage
LogLens persists some data in your browser's `localStorage` for a better user experience:
- **Search Filters**: Your last used filters and saved queries.
- **UI State**: Theme preference, sidebar state, etc.
- **Log Data**: The currently active log set (persisted via Zustand).

⚠️ **Privacy Note**: Because logs are stored in `localStorage`, they remain on your machine even after closing the tab. If you are handling sensitive logs, use the **"Clear Logs"** button before finishing your session to wipe this data.

#### Session Management
- Sessions are managed via secure, HTTP-only cookies.
- Logout completely clears the local session and invalidates the WorkOS token.

If a security incident occurs:

1. **Immediate Actions**:
   - Rotate all affected API keys and secrets
   - Notify affected users (if applicable)
   - Document the incident timeline

2. **Investigation**:
   - Identify root cause
   - Assess impact and data exposure
   - Review logs and audit trails

3. **Remediation**:
   - Deploy security patches
   - Update documentation
   - Implement preventive measures

4. **Post-Incident**:
   - Conduct security review
   - Update security policies
   - Share lessons learned with team

---

## Production Deployment Security

### Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All environment variables are set correctly
- [ ] No secrets are committed to Git
- [ ] `ignoreBuildErrors` is set to `false` in `next.config.mjs`
- [ ] HTTPS is enabled and enforced
- [ ] WorkOS production environment is configured
- [ ] Error tracking is enabled (Sentry, LogRocket, etc.)
- [ ] Backup and disaster recovery plan is in place
- [ ] Security headers are configured
- [ ] Rate limiting is enabled (if applicable)
- [ ] Monitoring and alerting are active

### Post-Deployment Verification

After deployment:

- [ ] Test authentication flows
- [ ] Verify HTTPS redirects work
- [ ] Check error boundaries function correctly
- [ ] Confirm no sensitive data in client-side bundles
- [ ] Review browser console for warnings/errors
- [ ] Run security scan (OWASP ZAP, Burp Suite)
- [ ] Verify CSP headers are active

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Contacts

- **Security Team**: security@loglens.dev
- **GitHub**: https://github.com/Keerthanreddy01/Loglens/security

---

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve LogLens security.

---

**Last Updated**: February 2026
