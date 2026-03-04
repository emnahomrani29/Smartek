# JWT Authentication Diagnosis & Fix Guide

## Current Status

Based on code analysis, the JWT authentication system is **properly configured** on both frontend and backend. However, the dashboard is not showing earned badges/certifications due to authentication issues.

## System Architecture

### Backend (✅ Properly Configured)

**Auth Service (Port 8081)**
- Generates JWT tokens with claims: `userId`, `role`, `subject` (email)
- Token expiration configured in `application.yml`
- Uses HS256 signing algorithm

**Certification-Badge Service (Port 8083)**
- Validates JWT tokens using shared secret
- Extracts user details: `userId`, `role`, `username` (email)
- Sets Spring Security context with `UserDetailsImpl`
- Enforces role-based access control

### Frontend (✅ Properly Configured)

**AuthService**
- Stores JWT token in `localStorage` under key `token`
- Stores user info in `localStorage` under key `userInfo`

**HTTP Interceptor**
- Adds `Authorization: Bearer <token>` header to all requests
- Handles 401/403 errors (currently logging only)

## Authorization Rules

### GET /api/certifications-badges/earned-badges/learner/{learnerId}

**Who can access:**
- ✅ ADMIN - can access any learner's data
- ✅ TRAINER - can access any learner's data
- ✅ RH_COMPANY - can access any learner's data
- ✅ RH_SMARTEK - can access any learner's data
- ✅ LEARNER - can ONLY access their own data (userId must match learnerId)

**Returns:**
- 200 OK - Success with badge list
- 403 FORBIDDEN - User doesn't have permission
- 401 UNAUTHORIZED - No valid JWT token

## Diagnostic Steps

### Step 1: Verify Services Are Running

```bash
# Check if auth-service is running
curl http://localhost:8081/actuator/health

# Check if certification-badge-service is running
curl http://localhost:8083/actuator/health
```

### Step 2: Test Login and Token Generation

```bash
# Login as a learner
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "learner1@example.com",
  "password": "password123"
}

# Expected response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "learner1@example.com",
  "firstName": "Learner1",
  "role": "LEARNER",
  "message": "Connexion réussie"
}
```

### Step 3: Decode JWT Token

Visit https://jwt.io and paste your token to verify it contains:

```json
{
  "sub": "learner1@example.com",
  "role": "LEARNER",
  "userId": 1,
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Step 4: Test Backend with JWT Token

```bash
# Replace <TOKEN> with actual JWT token
# Replace {learnerId} with actual user ID from token

GET http://localhost:8083/api/certifications-badges/earned-badges/learner/1
Authorization: Bearer <TOKEN>

# Expected response (if badges exist):
[
  {
    "id": 1,
    "badgeTemplate": {
      "id": 3,
      "name": "Spring Boot Silver Badge",
      "description": "Awarded for scoring 75% or higher",
      "examId": 102,
      "minimumScore": 75.0
    },
    "learnerId": 1,
    "awardDate": "2026-02-27",
    "awardedBy": 0
  }
]

# Expected response (if no badges):
[]

# Error response (wrong learner ID):
403 FORBIDDEN

# Error response (no token or invalid token):
401 UNAUTHORIZED
```

### Step 5: Browser DevTools Check

1. Open Angular app: http://localhost:4200
2. Login as a learner
3. Open DevTools (F12) → Application tab
4. Check localStorage:
   - ✅ `token` should exist with JWT value
   - ✅ `userInfo` should exist with user details
5. Navigate to "My Badges" page
6. Open DevTools → Network tab
7. Find the API request to `/earned-badges/learner/{id}`
8. Check Request Headers:
   - ✅ `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...` should be present
9. Check Response:
   - ✅ 200 OK with badge array
   - ❌ 401 UNAUTHORIZED - token missing or invalid
   - ❌ 403 FORBIDDEN - userId doesn't match learnerId

## Common Issues & Solutions

### Issue 1: Token Not Being Sent

**Symptoms:**
- Backend logs: "No authenticated user found"
- Network tab shows no Authorization header
- Response: 401 UNAUTHORIZED

**Solutions:**
1. Verify token exists in localStorage
2. Check if HTTP interceptor is registered in `app.config.ts`
3. Restart Angular dev server

**Fix:**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])  // ✅ Must be registered
    )
  ]
};
```

### Issue 2: Token Expired

**Symptoms:**
- Backend logs: "Invalid or expired JWT token"
- Response: 401 UNAUTHORIZED

**Solutions:**
1. Login again to get fresh token
2. Check token expiration in auth-service config
3. Implement token refresh mechanism

### Issue 3: Wrong Learner ID

**Symptoms:**
- Backend logs: "Learner X attempted to access data for learner Y"
- Response: 403 FORBIDDEN

**Solutions:**
1. Verify `userId` from localStorage matches the API path parameter
2. Check MyBadgesComponent is using correct user ID:

```typescript
// my-badges.component.ts
ngOnInit(): void {
  this.currentUser = this.authService.getUserInfo();
  if (this.currentUser) {
    this.loadBadges(this.currentUser.userId);  // ✅ Must match JWT userId
  }
}
```

### Issue 4: CORS Issues

**Symptoms:**
- Console error: "CORS policy blocked"
- Network tab shows preflight OPTIONS request failed

**Solutions:**
1. Check backend CORS configuration
2. Verify frontend is calling correct backend URL
3. Ensure backend allows Authorization header

### Issue 5: JWT Secret Mismatch

**Symptoms:**
- Backend logs: "Token validation failed"
- Response: 401 UNAUTHORIZED

**Solutions:**
1. Verify `jwt.secret` is identical in both services:
   - `Backend/auth-service/src/main/resources/application.yml`
   - `Backend/certification-badge-service/src/main/resources/application.yml`

## Testing Checklist

- [ ] Auth service is running on port 8081
- [ ] Certification-badge service is running on port 8083
- [ ] Angular app is running on port 4200
- [ ] Can login successfully and receive JWT token
- [ ] Token is stored in localStorage
- [ ] Token contains userId and role claims
- [ ] HTTP interceptor is registered
- [ ] Authorization header is added to requests
- [ ] Backend validates token successfully
- [ ] User can access their own data
- [ ] Badges/certifications are displayed

## Quick Test Script

```bash
# 1. Login and save token
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"learner1@example.com","password":"password123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get user ID from token (decode base64)
USER_ID=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"learner1@example.com","password":"password123"}' \
  | jq -r '.userId')

echo "User ID: $USER_ID"

# 3. Test badge endpoint
curl -X GET "http://localhost:8083/api/certifications-badges/earned-badges/learner/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Expected: JSON array of badges or empty array []
```

## Next Steps

1. **Restart Angular app** to ensure all changes are loaded:
   ```bash
   cd Frontend/angular-app
   # Stop current server (Ctrl+C)
   npm start
   ```

2. **Login as a learner** and check browser console for errors

3. **Navigate to "My Badges"** and check Network tab

4. **If still not working**, run the diagnostic steps above and report:
   - Is token in localStorage?
   - Is Authorization header in request?
   - What is the response status code?
   - What error appears in browser console?
   - What error appears in backend logs?

## Expected Behavior After Fix

1. User logs in → JWT token stored
2. User navigates to "My Badges" → Component loads
3. Component calls `badgeService.getBadgesByLearner(userId)`
4. HTTP interceptor adds `Authorization: Bearer <token>` header
5. Backend validates token and extracts userId
6. Backend checks authorization (userId matches learnerId)
7. Backend returns badge list
8. Frontend displays badges in grid

## Status

✅ Backend JWT validation - WORKING
✅ Frontend HTTP interceptor - WORKING
✅ Authorization logic - WORKING
✅ MyBadgesComponent - CREATED
✅ Badge model - FIXED
✅ Routes - UPDATED

⚠️ **NEEDS TESTING** - Restart Angular and test in browser
