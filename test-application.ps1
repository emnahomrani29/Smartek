# Script pour tester la soumission d'une candidature

Write-Host "=== TEST APPLICATION SUBMISSION ===" -ForegroundColor Cyan

# Données de test
$application = @{
    offerId = 7
    learnerId = 1
    learnerName = "Test User"
    learnerEmail = "test@example.com"
    coverLetter = "Test cover letter"
    cvBase64 = "VGVzdCBDViBjb250ZW50"  # "Test CV content" en base64
    cvFileName = "test-cv.pdf"
} | ConvertTo-Json

Write-Host "`nSending application..." -ForegroundColor Yellow
Write-Host "Data: $application" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/applications" `
        -Method Post `
        -Body $application `
        -ContentType "application/json"
    
    Write-Host "`nApplication submitted successfully!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Green
    
} catch {
    Write-Host "`nError submitting application:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== CHECK OFFERS-SERVICE LOGS ===" -ForegroundColor Yellow
Write-Host "Look for these messages in the offers-service terminal:" -ForegroundColor White
Write-Host "  - === APPLICATION SUBMISSION ===" -ForegroundColor Gray
Write-Host "  - Offer ID: ..." -ForegroundColor Gray
Write-Host "  - Learner ID: ..." -ForegroundColor Gray
Write-Host "  - Already applied check: ..." -ForegroundColor Gray
