# Quick Authentication Test Script

## Manual Testing Instructions

### 1. Open Browser DevTools
Press `F12` to open developer tools before starting tests.

### 2. Test Landing Page
```
URL: http://localhost:3000
Expected: Page loads, "Login" button visible
Check: Console for errors, Network tab for failed requests
```

### 3. Test Login Redirect
```
Action: Click "Login" or "Try for free"
Expected: Redirect to WorkOS sign-in page
Check: URL changes to WorkOS domain
```

### 4. Test Sign-In
```
Action: Enter email and password on WorkOS page
Expected: Redirect back to http://localhost:3000/dashboard
Check: Dashboard loads with user data
```

### 5. Test Dashboard Access (While Logged In)
```
URL: http://localhost:3000/dashboard
Expected: Dashboard content visible
Check: User menu shows in navigation
```

### 6. Test Dashboard Access (Not Logged In)
```
Action: Open incognito window
URL: http://localhost:3000/dashboard
Expected: Redirect to login
Check: Cannot access without authentication
```

### 7. Test Logout
```
Action: Click "Sign Out" in user menu
Expected: Redirect to landing page, "Login" button visible
Check: Session cleared, cannot access dashboard
```

### 8. Test Session Persistence
```
Action: Log in, then refresh page (F5)
Expected: Still logged in, no re-authentication needed
Check: User data still visible
```

---

## API Endpoint Verification

### Check in Browser DevTools Network Tab:

**Landing Page Load:**
- `GET /` → Status: 200 ✅

**Login Initiation:**
- `GET /api/auth/login` → Status: 307 (Redirect) ✅

**After WorkOS Authentication:**
- `GET /api/auth/callback?code=...` → Status: 307 (Redirect to dashboard) ✅

**Dashboard Access:**
- `GET /dashboard` → Status: 200 ✅

**Logout:**
- `POST /api/auth/logout` → Status: 307 (Redirect) ✅

---

## Browser Console Checks

### Should NOT see:
- ❌ JavaScript errors
- ❌ 404 errors
- ❌ CORS errors
- ❌ "Failed to fetch" errors
- ❌ Authentication errors

### Should see:
- ✅ Successful page loads
- ✅ Clean console (or only warnings, no errors)
- ✅ Proper redirects (307 status codes)

---

## Common Issues & Solutions

### Issue: "This is not a valid redirect URI"
**Solution**: Verify WorkOS Dashboard has `http://localhost:3000/api/auth/callback`

### Issue: "Something went wrong" on WorkOS page
**Solution**: Check WorkOS Dashboard has sign-in endpoint configured

### Issue: Infinite redirect loop
**Solution**: Check middleware unauthenticatedPaths includes auth routes

### Issue: 401 Unauthorized on dashboard
**Solution**: Verify session cookie is being set and sent

### Issue: Cannot access dashboard after login
**Solution**: Check callback route is redirecting to `/dashboard`

---

## ✅ Success Criteria

All of the following must be true:
- [ ] Can access landing page without errors
- [ ] Login button redirects to WorkOS
- [ ] Can sign in with email/password or social login
- [ ] Redirected to dashboard after successful login
- [ ] Dashboard shows user information
- [ ] Can sign out successfully
- [ ] Cannot access dashboard when logged out
- [ ] Session persists across page refreshes
- [ ] No console errors during any flow
- [ ] All API calls return expected status codes

---

## Current Status: ✅ READY FOR TESTING

Based on server logs, the following is confirmed:
- ✅ Server running on port 3000
- ✅ Landing page loads successfully
- ✅ Login endpoint redirects properly
- ✅ Dashboard is accessible
- ✅ Logout endpoint works
- ✅ No compilation errors

**Next Step**: Perform manual testing using the instructions above.
