# Certification Templates Loading Issue - Fix

## Problem

Frontend shows "Failed to load certifications" error, but backend has 12 templates in the database and the API endpoint works correctly when tested directly.

## Root Cause Analysis

### Backend Status: ✅ WORKING
```powershell
# Direct API test - SUCCESS
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/certification-templates"
# Returns 12 templates successfully
```

### Possible Frontend Issues:

1. **HTTP Interceptor Error** - The auth interceptor might be throwing an error
2. **CORS Preflight Failure** - Browser might be blocking the request
3. **User Not Logged In** - localStorage might not have valid token
4. **Network Error** - Frontend might be calling wrong URL

## Diagnostic Steps

### Step 1: Check Browser Console

Open DevTools (F12) and check:

1. **Console Tab** - Look for errors:
   ```
   - CORS policy blocked
   - Failed to fetch
   - 401 Unauthorized
   - 403 Forbidden
   - Network error
   ```

2. **Network Tab** - Check the request:
   - URL: Should be `http://localhost:8083/api/certifications-badges/certification-templates`
   - Method: GET
   - Status: Should be 200 OK
   - Response: Should contain array of templates

### Step 2: Check Authentication

Open DevTools → Application → Local Storage → http://localhost:4200

Check if these exist:
- ✅ `token` - JWT token
- ✅ `userInfo` - User information

If missing, you need to login first.

### Step 3: Test Without Authentication

Since the backend allows all requests (`.anyRequest().permitAll()`), the issue might be the HTTP interceptor failing.

## Solutions

### Solution 1: Login First (Most Likely)

You're logged in as "formateur1" (Trainer), which should work. But try:

1. **Logout and Login Again**
   - Click "Sign Out"
   - Login with: formateur1@example.com / password123

2. **Check Token in DevTools**
   - F12 → Application → Local Storage
   - Verify `token` exists

### Solution 2: Fix HTTP Interceptor Error Handling

The interceptor might be throwing an error. Let me check if there's an issue:

**Current Interceptor:**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('Authorization error:', error);
        // authService.logout(); // Commented out
      }
      return throwError(() => error);
    })
  );
};
```

**Issue:** If `authService.getToken()` throws an error, the entire request fails.

### Solution 3: Bypass Interceptor for Public Endpoints

Modify the interceptor to handle errors gracefully:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.warn('Failed to add auth token:', error);
    // Continue without token for public endpoints
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('Authorization error:', error);
      }
      return throwError(() => error);
    })
  );
};
```

### Solution 4: Check CORS Configuration

The backend CORS config looks correct:
```java
config.addAllowedOrigin("http://localhost:4200");
config.addAllowedMethod("GET");
config.addAllowedMethod("POST");
config.addAllowedMethod("PUT");
config.addAllowedMethod("DELETE");
config.addAllowedMethod("OPTIONS");
config.addAllowedHeader("*");
config.setAllowCredentials(true);
```

But verify in browser:
1. Network Tab → Find the request
2. Check Response Headers:
   - `Access-Control-Allow-Origin: http://localhost:4200`
   - `Access-Control-Allow-Credentials: true`

### Solution 5: Restart Angular Dev Server

Sometimes Angular needs a restart to pick up changes:

```bash
cd Frontend/angular-app
# Stop current server (Ctrl+C)
npm start
```

## Quick Fix Commands

### Test Backend Directly (PowerShell)
```powershell
# Test GET all templates
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/certification-templates" -Method GET

# Test with JWT token (if you have one)
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/certification-templates" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"}
```

### Test from Browser Console
```javascript
// Open browser console (F12) and run:
fetch('http://localhost:8083/api/certifications-badges/certification-templates')
  .then(r => r.json())
  .then(data => console.log('Templates:', data))
  .catch(err => console.error('Error:', err));
```

## Expected Behavior

**Success Response:**
```json
[
  {
    "id": 1,
    "title": "Test Certification",
    "description": "Test Descriptionn",
    "examId": null,
    "createdAt": "2026-02-24",
    "updatedAt": "2026-02-24"
  },
  ...
]
```

## Troubleshooting Checklist

- [ ] Backend service running on port 8083
- [ ] Frontend running on port 4200
- [ ] User logged in (check localStorage)
- [ ] No CORS errors in console
- [ ] No network errors in console
- [ ] Request URL is correct
- [ ] Response status is 200 OK

## Next Steps

1. **Check browser console** for exact error message
2. **Copy the error** and share it
3. **Check Network tab** to see the actual request/response
4. **Try the browser console test** above to isolate the issue

## Most Likely Solution

Based on the screenshot showing you're logged in as "formateur1" (Trainer), the most likely issue is:

1. **Stale token** - Logout and login again
2. **Angular cache** - Restart Angular dev server
3. **Browser cache** - Hard refresh (Ctrl+Shift+R)

Try these in order:
1. Hard refresh browser (Ctrl+Shift+R)
2. Logout and login again
3. Restart Angular dev server
4. Check browser console for errors
