# Script pour vérifier l'état des services

Write-Host "=== Vérification des Services ===" -ForegroundColor Cyan

# Vérifier Eureka Server
Write-Host "`n1. Eureka Server (port 8761):" -ForegroundColor Yellow
try {
    $eureka = Invoke-WebRequest -Uri "http://localhost:8761" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Status: $($eureka.StatusCode) - OK" -ForegroundColor Green
} catch {
    Write-Host "   Status: ERREUR - Service non disponible" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Vérifier Auth Service
Write-Host "`n2. Auth Service (port 8081):" -ForegroundColor Yellow
try {
    $auth = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Status: $($auth.StatusCode) - OK" -ForegroundColor Green
    Write-Host "   Health: $($auth.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   Status: ERREUR - Service non disponible" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Vérifier Offers Service
Write-Host "`n3. Offers Service (port 8085):" -ForegroundColor Yellow
try {
    $offers = Invoke-WebRequest -Uri "http://localhost:8085/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Status: $($offers.StatusCode) - OK" -ForegroundColor Green
    Write-Host "   Health: $($offers.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   Status: ERREUR - Service non disponible" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Vérifier API Gateway
Write-Host "`n4. API Gateway (port 8080):" -ForegroundColor Yellow
try {
    $gateway = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   Status: $($gateway.StatusCode) - OK" -ForegroundColor Green
    Write-Host "   Health: $($gateway.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   Status: ERREUR - Service non disponible" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

# Tester la route des applications via Gateway
Write-Host "`n5. Test route /api/applications via Gateway:" -ForegroundColor Yellow
try {
    $apps = Invoke-WebRequest -Uri "http://localhost:8080/api/applications" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "   Status: $($apps.StatusCode) - Route accessible" -ForegroundColor Green
} catch {
    Write-Host "   Status: ERREUR - $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Fin de la vérification ===" -ForegroundColor Cyan
Write-Host "`nSi offers-service est DOWN, vérifiez:" -ForegroundColor Yellow
Write-Host "  1. Le service est-il démarré? (mvn spring-boot:run)" -ForegroundColor White
Write-Host "  2. Vérifiez les logs du service pour les erreurs" -ForegroundColor White
Write-Host "  3. Vérifiez que MySQL est accessible" -ForegroundColor White
Write-Host "  4. Avez-vous exécuté le script fix-applications-table.sql?" -ForegroundColor White
