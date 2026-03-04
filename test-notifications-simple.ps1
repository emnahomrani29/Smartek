# Script simple pour tester les notifications

Write-Host "=== TEST NOTIFICATION SYSTEM ===" -ForegroundColor Cyan

# 1. Vérifier les learners
Write-Host "`n1. Checking learners..." -ForegroundColor Yellow
try {
    $learners = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/users/role/LEARNER"
    Write-Host "Found $($learners.Count) learner(s): $($learners -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Créer une offre
Write-Host "`n2. Creating test offer..." -ForegroundColor Yellow
$offer = @{
    title = "Test Offer $(Get-Date -Format 'HH:mm:ss')"
    description = "Test description"
    companyName = "Test Company"
    location = "Paris"
    contractType = "CDI"
    salary = "50000"
    companyId = 1
    status = "ACTIVE"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:8085/api/offers" -Method Post -Body $offer -ContentType "application/json"
    Write-Host "Offer created: ID=$($result.id), Status=$($result.status)" -ForegroundColor Green
    
    Write-Host "`nWaiting 3 seconds for async processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    # 3. Vérifier les notifications
    if ($learners -and $learners.Count -gt 0) {
        Write-Host "`n3. Checking notifications for learner $($learners[0])..." -ForegroundColor Yellow
        $notifications = Invoke-RestMethod -Uri "http://localhost:8085/api/notifications/user/$($learners[0])"
        Write-Host "Found $($notifications.Count) notification(s)" -ForegroundColor Green
        
        if ($notifications.Count -gt 0) {
            $latest = $notifications[0]
            Write-Host "Latest: $($latest.title)" -ForegroundColor Cyan
            Write-Host "Message: $($latest.message)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== CHECK OFFERS-SERVICE LOGS ===" -ForegroundColor Yellow
Write-Host "Look for these messages:" -ForegroundColor White
Write-Host "  - === OFFER CREATED ===" -ForegroundColor Gray
Write-Host "  - === CALLING NOTIFICATION SERVICE ===" -ForegroundColor Gray
Write-Host "  - Notifying learners about new offer" -ForegroundColor Gray
