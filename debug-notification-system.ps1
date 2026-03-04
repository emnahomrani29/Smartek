# Script de débogage du système de notification

Write-Host "=== DEBUGGING NOTIFICATION SYSTEM ===" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier que auth-service est accessible
Write-Host "1. Checking auth-service..." -ForegroundColor Yellow
try {
    $authHealth = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/health" -Method Get
    Write-Host "   ✓ Auth service is running: $authHealth" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Auth service is NOT accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. Vérifier qu'il y a des learners
Write-Host "2. Checking for learners..." -ForegroundColor Yellow
try {
    $learners = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/users/role/LEARNER" -Method Get
    Write-Host "   ✓ Found $($learners.Count) learner(s)" -ForegroundColor Green
    if ($learners.Count -eq 0) {
        Write-Host "   ⚠ WARNING: No learners found! Create a learner account first." -ForegroundColor Yellow
    } else {
        Write-Host "   Learner IDs: $($learners -join ', ')" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ✗ Cannot retrieve learners!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Vérifier que offers-service est accessible
Write-Host "3. Checking offers-service..." -ForegroundColor Yellow
try {
    $offersHealth = Invoke-RestMethod -Uri "http://localhost:8085/actuator/health" -Method Get
    Write-Host "   ✓ Offers service is running: $($offersHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Offers service is NOT accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 4. Créer une offre de test
Write-Host "4. Creating test offer..." -ForegroundColor Yellow
$testOffer = @{
    title = "Test Notification - $(Get-Date -Format 'HH:mm:ss')"
    description = "This is a test offer to verify notifications"
    companyName = "Test Company"
    location = "Test Location"
    contractType = "CDI"
    salary = "50000€"
    companyId = 1
    status = "ACTIVE"
} | ConvertTo-Json

try {
    $createdOffer = Invoke-RestMethod -Uri "http://localhost:8085/api/offers" `
        -Method Post `
        -Body $testOffer `
        -ContentType "application/json"
    
    Write-Host "   ✓ Offer created successfully!" -ForegroundColor Green
    Write-Host "   Offer ID: $($createdOffer.id)" -ForegroundColor Cyan
    Write-Host "   Title: $($createdOffer.title)" -ForegroundColor Cyan
    Write-Host "   Status: $($createdOffer.status)" -ForegroundColor Cyan
    
    $offerId = $createdOffer.id
    
    Write-Host ""
    Write-Host "   ⏳ Waiting 3 seconds for async notification processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
} catch {
    Write-Host "   ✗ Failed to create offer!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit
}

Write-Host ""

# 5. Vérifier les notifications créées
Write-Host "5. Checking notifications in database..." -ForegroundColor Yellow
Write-Host "   Run this SQL query to check:" -ForegroundColor Cyan
Write-Host "   SELECT * FROM offers_db.notifications WHERE related_offer_id = $offerId;" -ForegroundColor White

Write-Host ""

# 6. Tester l'API de notifications
if ($learners -and $learners.Count -gt 0) {
    $testLearnerId = $learners[0]
    Write-Host "6. Testing notification API for learner ID $testLearnerId..." -ForegroundColor Yellow
    
    try {
        $notifications = Invoke-RestMethod -Uri "http://localhost:8085/api/notifications/user/$testLearnerId" -Method Get
        Write-Host "   ✓ Found $($notifications.Count) notification(s) for this learner" -ForegroundColor Green
        
        if ($notifications.Count -gt 0) {
            Write-Host "   Latest notification:" -ForegroundColor Cyan
            $latest = $notifications[0]
            Write-Host "     - Title: $($latest.title)" -ForegroundColor White
            Write-Host "     - Message: $($latest.message)" -ForegroundColor White
            Write-Host "     - Related Offer ID: $($latest.relatedOfferId)" -ForegroundColor White
            Write-Host "     - Is Read: $($latest.isRead)" -ForegroundColor White
        }
        
        # Compter les non lues
        $unreadCount = Invoke-RestMethod -Uri "http://localhost:8085/api/notifications/user/$testLearnerId/unread/count" -Method Get
        Write-Host "   Unread notifications: $unreadCount" -ForegroundColor Cyan
        
    } catch {
        Write-Host "   ✗ Cannot retrieve notifications!" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== DEBUGGING COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check the offers-service console logs for:" -ForegroundColor White
Write-Host "   - '=== OFFER CREATED ==='" -ForegroundColor Gray
Write-Host "   - '=== CALLING NOTIFICATION SERVICE ==='" -ForegroundColor Gray
Write-Host "   - 'Notifying learners about new offer'" -ForegroundColor Gray
Write-Host "   - 'Found X learners to notify'" -ForegroundColor Gray
Write-Host "   - 'Notification created for learner ID: X'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run the SQL script to check database:" -ForegroundColor White
Write-Host "   mysql -u root -p offers_db" -ForegroundColor Gray
Write-Host ""
Write-Host "3. If no notifications are created, check for errors in logs" -ForegroundColor White
