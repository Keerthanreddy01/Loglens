# GITHUB COMMIT ATTRIBUTION & PROFESSIONAL PUSH GUIDE

This guide outlines how to ensure your contributions show up correctly on your GitHub profile and follows professional standards for commits and pushes.

## 🎯 Problem: Commits Not Showing in Profile
If your commits show in the repo but not on your contributions graph, set your email correctly.

### Check current config:
```bash
git config user.email
```

### Set correct email (GitHub noreply recommended):
```bash
git config user.email "12345678+Keerthanreddy01@users.noreply.github.com"
```
*Note: Replace `12345678` with your actual GitHub ID from your email settings.*

## 📝 Commit Standards (Conventional Commits)
Format: `<type>(<scope>): <subject>`

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `perf` | Performance |
| `chore` | Maintenance |

## 🚀 Professional Workflow
1. **Lint & Build**: Always run `npm run lint` and `npm run build` before pushing.
2. **Pre-push Check**: Run `npm run pre-push` to scan for secrets.
3. **Atomic Commits**: Keep commits focused on one thing.
4. **Descriptive Messages**: Explain *why*, not just *what*.
