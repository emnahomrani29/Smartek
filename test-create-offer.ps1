# Script PowerShell pour tester la création d'une offre

$body = @{
    title = "Développeur Full Stack"
    description = "Nous recherchons un développeur Full Stack expérimenté avec des compétences en Angular et Spring Boot"
    companyName = "TechCorp"
    location = "Paris"
    contractType = "CDI"
    salary = "45000-55000€"
    companyId = 1
    status = "ACTIVE"
} | ConvertTo-Json

Write-Host "Creating new offer..." -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/offers" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "`nOffer created successfully!" -ForegroundColor Green
    Write-Host "Offer ID: $($response.id)" -ForegroundColor Green
    Write-Host "Title: $($response.title)" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Green
    
    Write-Host "`nCheck the offers-service logs for notification messages..." -ForegroundColor Yellow
    Write-Host "You should see:" -ForegroundColor Cyan
    Write-Host "  - === OFFER CREATED ===" -ForegroundColor Cyan
    Write-Host "  - === CALLING NOTIFICATION SERVICE ===" -ForegroundColor Cyan
    Write-Host "  - Notifying learners about new offer..." -ForegroundColor Cyan
    
} catch {
    Write-Host "`nError creating offer:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
