# Quick Start - Testing the Auto-Award System

## 🚀 Quick Test (5 minutes)

### 1. Restart Angular (REQUIRED)
```bash
cd Frontend/angular-app
npm start
```
Wait for "Compiled successfully" message.

### 2. Login to the App
- Open browser: http://localhost:4200
- Login as: learner1@example.com / password123

### 3. Check "My Badges" Page
- Click "My Badges" in sidebar
- Should see badges (if any exist)
- If empty, continue to step 4

### 4. Award Test Badge (Optional)
Open PowerShell and run:
```powershell
$body = @{
    learnerId = 1
    examId = 102
    score = 75.0
    maxScore = 100.0
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/exam-integration/process-exam-result" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"; "X-Internal-Api-Key"="exam-service-dev-key"} `
    -Body $body
```

### 5. Refresh Browser
- Go back to "My Badges" page
- Should now see the Silver badge

## ✅ Expected Results

**My Certifications Page:**
- Shows "Spring Boot Fundamentals" certification
- Award date: 2026-02-27
- Expiry date: 2028-02-27

**My Badges Page:**
- Shows "Spring Boot Silver Badge"
- Description: "Awarded for scoring 75% or higher"
- Minimum Score: 75%
- Award date: 2026-02-27

## 🔍 Troubleshooting

### Issue: Empty pages (no badges/certifications)
**Solution:** Run step 4 to create test data

### Issue: 401 Unauthorized error
**Solution:** 
1. Logout and login again
2. Check browser console for errors
3. Verify token in DevTools → Application → Local Storage

### Issue: 403 Forbidden error
**Solution:** 
1. Check userId in localStorage matches the learner ID
2. Verify you're logged in as a LEARNER role

### Issue: Page not loading
**Solution:**
1. Check backend is running: http://localhost:8083/actuator/health
2. Check auth service is running: http://localhost:8081/actuator/health
3. Check browser console for errors

## 📚 Detailed Documentation

- **Full Status Report:** `FINAL-STATUS-REPORT.md`
- **JWT Troubleshooting:** `JWT-AUTHENTICATION-DIAGNOSIS.md`
- **API Testing:** `test-jwt-flow.http`
- **Postman Collection:** `Backend/certification-badge-service/Auto-Award-System.postman_collection.json`
- **Postman Guide:** `Backend/certification-badge-service/POSTMAN-TESTING-GUIDE.md`

## 🎯 Test Scenarios

### Scenario 1: Failing Score (45%)
```powershell
$body = @{learnerId=2; examId=102; score=45.0; maxScore=100.0} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/exam-integration/process-exam-result" -Method POST -Headers @{"Content-Type"="application/json"; "X-Internal-Api-Key"="exam-service-dev-key"} -Body $body
```
**Expected:** Nothing awarded

### Scenario 2: Bronze Badge (60%)
```powershell
$body = @{learnerId=3; examId=102; score=60.0; maxScore=100.0} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/exam-integration/process-exam-result" -Method POST -Headers @{"Content-Type"="application/json"; "X-Internal-Api-Key"="exam-service-dev-key"} -Body $body
```
**Expected:** Certification + Bronze badge

### Scenario 3: Silver Badge (75%)
```powershell
$body = @{learnerId=1; examId=102; score=75.0; maxScore=100.0} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/exam-integration/process-exam-result" -Method POST -Headers @{"Content-Type"="application/json"; "X-Internal-Api-Key"="exam-service-dev-key"} -Body $body
```
**Expected:** Certification + Silver badge

### Scenario 4: Gold Badge (92%)
```powershell
$body = @{learnerId=4; examId=102; score=92.0; maxScore=100.0} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8083/api/certifications-badges/exam-integration/process-exam-result" -Method POST -Headers @{"Content-Type"="application/json"; "X-Internal-Api-Key"="exam-service-dev-key"} -Body $body
```
**Expected:** Certification + Gold badge

## 📊 System Status

✅ Backend (Port 8083) - READY
✅ Auth Service (Port 8081) - READY
✅ Frontend (Port 4200) - READY
✅ Auto-Award Logic - WORKING
✅ JWT Authentication - CONFIGURED
✅ Integration Tests - PASSING (6/6)
✅ Postman Collection - READY

## 🎉 Success Criteria

- [ ] Can login as learner
- [ ] Can see "My Certifications" page
- [ ] Can see "My Badges" page
- [ ] Badges display with correct details
- [ ] Certifications display with correct details
- [ ] Auto-award creates new badges/certifications
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

**Need Help?** Check the detailed documentation files listed above.
