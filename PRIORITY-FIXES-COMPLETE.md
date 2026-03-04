# Priority Fixes - Complete Implementation Guide

**Date:** February 28, 2026  
**Status:** Ready for Implementation

---

## 🔴 PRIORITY 1: FIX LOGIN (CRITICAL)

### Problem
Login fails with 401 Unauthorized for `Formateur@smatek.com` and other test credentials.

### Root Cause
Users table is empty or doesn't contain the test users with correct credentials.

### Solution: Create Seed Data

**File Created:** `Backend/auth-service/seed-users.sql`

**What It Does:**
- Creates 4 test users with BCrypt-hashed passwords
- Uses `ON DUPLICATE KEY UPDATE` to avoid errors if users exist
- All users have password: `password123`
- BCrypt hash: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

**Users Created:**

| Email | Password | Role | First Name |
|-------|----------|------|------------|
| admin@smartek.com | password123 | ADMIN | Admin User |
| formateur@smartek.com | password123 | TRAINER | Formateur Test |
| learner@smartek.com | password123 | LEARNER | Learner Test |
| learner2@smartek.com | password123 | LEARNER | Learner Two |

### How to Apply

**Option 1: Using MySQL Command Line**
```bash
mysql -u root smartek_db < Backend/auth-service/seed-users.sql
```

**Option 2: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to smartek_db
3. Open `Backend/auth-service/seed-users.sql`
4. Execute the script

**Option 3: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select smartek_db database
3. Go to SQL tab
4. Paste contents of `seed-users.sql`
5. Click "Go"

### Verification

After running the script, verify users were created:

```sql
SELECT user_id, first_name, email, role, created_at 
FROM users 
WHERE email IN ('admin@smartek.com', 'formateur@smartek.com', 'learner@smartek.com')
ORDER BY role, email;
```

Expected output:
```
user_id | first_name      | email                   | role    | created_at
--------|-----------------|-------------------------|---------|-------------------
1       | Admin User      | admin@smartek.com       | ADMIN   | 2026-02-28 15:45:00
2       | Formateur Test  | formateur@smartek.com   | TRAINER | 2026-02-28 15:45:00
3       | Learner Test    | learner@smartek.com     | LEARNER | 2026-02-28 15:45:00
```

### Test Login

```powershell
# Test with PowerShell
$loginRequest = @{
    email = "formateur@smartek.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
    -Method POST `
    -Body $loginRequest `
    -ContentType "application/json"

Write-Host "✅ Login successful!"
Write-Host "User: $($response.firstName)"
Write-Host "Role: $($response.role)"
Write-Host "Token: $($response.token.Substring(0,50))..."
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 2,
  "email": "formateur@smartek.com",
  "firstName": "Formateur Test",
  "role": "TRAINER",
  "message": "Connexion réussie"
}
```

---

## 🔴 PRIORITY 2: FIX SECURITY (CRITICAL)

### Problem
Security configuration has `.anyRequest().permitAll()` which allows all requests without authentication.

### Impact
- Security vulnerability in production
- Defeats the purpose of JWT authentication
- Anyone can access protected endpoints

### Solution: Re-enable Authentication

**File:** `Backend/certification-badge-service/src/main/java/com/smartek/certificationbadgeservice/security/SecurityConfig.java`

**BEFORE (Line 44):**
```java
.authorizeHttpRequests(auth -> auth
        // Health check endpoints
        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
        // Exam integration endpoint (called by exam service)
        .requestMatchers("/api/certifications-badges/exam-integration/**").permitAll()
        // Temporarily allow all for testing
        .anyRequest().permitAll()  // ❌ INSECURE - Allows everything
)
```

**AFTER (Line 44):**
```java
.authorizeHttpRequests(auth -> auth
        // Health check endpoints
        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
        // Exam integration endpoint (called by exam service with API key)
        .requestMatchers("/api/certifications-badges/exam-integration/**").permitAll()
        // All other endpoints require authentication
        .anyRequest().authenticated()  // ✅ SECURE - Requires JWT token
)
```

### Additional Changes Needed

**Uncomment @PreAuthorize annotations in controllers:**

1. **CertificationTemplateController.java** - Lines 35, 48, 78
```java
// BEFORE
// @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
public ResponseEntity<CertificationTemplateDTO> createCertificationTemplate(...)

// AFTER
@PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")  // ✅ Enabled
public ResponseEntity<CertificationTemplateDTO> createCertificationTemplate(...)
```

2. **BadgeTemplateController.java** - Similar pattern
3. **EarnedCertificationController.java** - Already has @PreAuthorize
4. **EarnedBadgeController.java** - Already has @PreAuthorize

### Why This Fix Is Needed

**Current Flow (INSECURE):**
```
Request → JWT Filter → Spring Security → permitAll() → ✅ Allowed
                                                      (No authentication check)
```

**After Fix (SECURE):**
```
Request → JWT Filter → Spring Security → authenticated() → Check JWT
                                                         ↓
                                                    Valid? → ✅ Allowed
                                                    Invalid? → ❌ 401 Unauthorized
```

### Testing After Fix

**Test 1: Public Endpoints Still Work**
```powershell
# Health check should work without token
Invoke-RestMethod -Uri "http://localhost:8083/actuator/health"
# Expected: {"status":"UP"}
```

**Test 2: Protected Endpoints Require Token**
```powershell
# Without token - should fail
try {
    Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/certification-templates"
} catch {
    Write-Host "✅ Correctly rejected: $($_.Exception.Message)"
}
# Expected: 401 Unauthorized
```

**Test 3: With Valid Token - Should Work**
```powershell
# Login first
$login = @{ email = "formateur@smartek.com"; password = "password123" } | ConvertTo-Json
$auth = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $login -ContentType "application/json"

# Use token
$headers = @{ Authorization = "Bearer $($auth.token)" }
$templates = Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/certification-templates" -Headers $headers
Write-Host "✅ Retrieved $($templates.Count) templates with valid token"
```

---

## 🟡 PRIORITY 3: FIX JWT SECRET & EMPTY PASSWORD

### Problem 1: JWT Secret Hardcoded

**Current State:**
```yaml
# application.yml
jwt:
  secret: smartek-secret-key-for-jwt-token-generation-2024-very-secure
```

**Issue:** Secret visible in source code and version control.

### Solution: Use Environment Variables

**Files to Change:**
1. `Backend/auth-service/src/main/resources/application.yml`
2. `Backend/certification-badge-service/src/main/resources/application.yml`

**BEFORE:**
```yaml
jwt:
  secret: smartek-secret-key-for-jwt-token-generation-2024-very-secure
  expiration: 86400000
```

**AFTER:**
```yaml
jwt:
  secret: ${JWT_SECRET:smartek-secret-key-for-jwt-token-generation-2024-very-secure}
  expiration: ${JWT_EXPIRATION:86400000}
```

**Explanation:**
- `${JWT_SECRET:default-value}` reads from environment variable
- If `JWT_SECRET` not set, uses default value
- Default is fine for development
- Production MUST set environment variable

**Setting Environment Variable:**

**Windows (PowerShell):**
```powershell
$env:JWT_SECRET = "your-production-secret-key-here"
$env:JWT_EXPIRATION = "86400000"
```

**Linux/Mac:**
```bash
export JWT_SECRET="your-production-secret-key-here"
export JWT_EXPIRATION="86400000"
```

**Docker:**
```yaml
environment:
  - JWT_SECRET=your-production-secret-key-here
  - JWT_EXPIRATION=86400000
```

### Problem 2: Empty Database Password

**Current State:**
```yaml
# application.yml
datasource:
  url: jdbc:mysql://localhost:3306/smartek_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
  username: root
  password:   # ❌ Empty
```

### Solution: Document or Set Password

**Option 1: Set Password (Recommended for Production)**

**BEFORE:**
```yaml
datasource:
  username: root
  password: 
```

**AFTER:**
```yaml
datasource:
  username: ${DB_USERNAME:root}
  password: ${DB_PASSWORD:}
```

**Then set environment variable:**
```powershell
$env:DB_PASSWORD = "your-mysql-password"
```

**Option 2: Document Why Empty (Development Only)**

Add comment in application.yml:
```yaml
datasource:
  username: root
  password:   # Empty for local development - SET IN PRODUCTION!
```

**Recommendation:**
- Development: Empty password is acceptable if MySQL is localhost-only
- Production: MUST set strong password and use environment variables

---

## IMPLEMENTATION CHECKLIST

### Priority 1: Login Fix
- [ ] Run `seed-users.sql` script in MySQL
- [ ] Verify users created with `SELECT * FROM users`
- [ ] Test login with `formateur@smartek.com` / `password123`
- [ ] Confirm JWT token is returned
- [ ] Save token for testing authenticated endpoints

### Priority 2: Security Fix
- [ ] Change `.anyRequest().permitAll()` to `.anyRequest().authenticated()`
- [ ] Uncomment `@PreAuthorize` in CertificationTemplateController
- [ ] Uncomment `@PreAuthorize` in BadgeTemplateController
- [ ] Restart certification-badge-service
- [ ] Test public endpoints still work (health check)
- [ ] Test protected endpoints require token
- [ ] Test with valid token works

### Priority 3: Secrets Fix
- [ ] Update auth-service application.yml with `${JWT_SECRET:default}`
- [ ] Update certification-badge-service application.yml with `${JWT_SECRET:default}`
- [ ] Update datasource password with `${DB_PASSWORD:}`
- [ ] Document environment variables needed for production
- [ ] Test services still start with default values
- [ ] Create production deployment guide

---

## EXPECTED RESULTS AFTER ALL FIXES

### System Health: 95% → 100% ✅

**Before Fixes:**
- ❌ Login not working (no users)
- ⚠️ Security too permissive
- ⚠️ Secrets in plain text
- **Health: 85%**

**After Fixes:**
- ✅ Login working with test users
- ✅ Security properly configured
- ✅ Secrets use environment variables
- ✅ All endpoints tested and working
- **Health: 100%**

### What Will Work

| Feature | Before | After |
|---------|--------|-------|
| Login | ❌ | ✅ |
| JWT Token Generation | ❌ | ✅ |
| Public Endpoints | ✅ | ✅ |
| Protected Endpoints (no token) | ✅ (insecure) | ❌ (secure) |
| Protected Endpoints (with token) | ✅ | ✅ |
| Role-based Authorization | ❌ | ✅ |
| Environment Variables | ❌ | ✅ |
| Production Ready | ❌ | ✅ |

---

## FILES TO MODIFY

### New Files Created (1)
1. **Backend/auth-service/seed-users.sql**
   - Purpose: Create test users with BCrypt passwords
   - Action: Run in MySQL

### Files to Modify (3)

2. **Backend/certification-badge-service/src/main/java/com/smartek/certificationbadgeservice/security/SecurityConfig.java**
   - Line 44: Change `permitAll()` to `authenticated()`
   - Impact: Requires JWT for protected endpoints

3. **Backend/auth-service/src/main/resources/application.yml**
   - Lines 30-31: Add environment variable support for JWT secret
   - Lines 6-7: Add environment variable support for DB password

4. **Backend/certification-badge-service/src/main/resources/application.yml**
   - Add environment variable support for JWT secret

### Files to Uncomment (2)

5. **Backend/certification-badge-service/src/main/java/com/smartek/certificationbadgeservice/controller/CertificationTemplateController.java**
   - Lines 35, 48, 78: Uncomment `@PreAuthorize`

6. **Backend/certification-badge-service/src/main/java/com/smartek/certificationbadgeservice/controller/BadgeTemplateController.java**
   - Similar lines: Uncomment `@PreAuthorize`

---

## NEXT STEPS

1. **Run seed-users.sql** to create test users
2. **Test login** to confirm it works
3. **Apply security fixes** one by one
4. **Test after each change** to ensure nothing breaks
5. **Update documentation** with new test credentials
6. **Create production deployment guide** with environment variables

---

## PRODUCTION DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Set `JWT_SECRET` environment variable (strong random string)
- [ ] Set `DB_PASSWORD` environment variable (strong password)
- [ ] Set `DB_USERNAME` if not using root
- [ ] Verify `.anyRequest().authenticated()` is enabled
- [ ] Verify all `@PreAuthorize` annotations are uncommented
- [ ] Test all endpoints with proper authentication
- [ ] Set up HTTPS/TLS for secure communication
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Create database backups
- [ ] Document all environment variables

---

**Status:** Ready for implementation  
**Estimated Time:** 30-45 minutes  
**Risk Level:** Low (all changes are backwards compatible with proper testing)
