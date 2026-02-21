@echo off
chcp 65001 >nul
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              🚀 SMARTEK - Démarrage Complet 🚀               ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Démarrage de tous les services dans l'ordre...
echo.

REM ============================================
REM 1. EUREKA SERVER
REM ============================================
echo [1/5] 🔵 Démarrage Eureka Server (Port 8761)...
start "🔵 Eureka Server - 8761" cmd /k "color 0B && cd Backend\eureka-server && echo Démarrage Eureka Server... && mvn spring-boot:run"
echo       ⏳ Attente 35 secondes pour Eureka...
timeout /t 35 /nobreak >nul
echo       ✅ Eureka Server démarré
echo.

REM ============================================
REM 2. CONFIG SERVER
REM ============================================
echo [2/5] 🟢 Démarrage Config Server (Port 8888)...
start "🟢 Config Server - 8888" cmd /k "color 0A && cd Backend\config-server && echo Démarrage Config Server... && mvn spring-boot:run"
echo       ⏳ Attente 25 secondes pour Config Server...
timeout /t 25 /nobreak >nul
echo       ✅ Config Server démarré
echo.

REM ============================================
REM 3. AUTH SERVICE
REM ============================================
echo [3/5] 🟡 Démarrage Auth Service (Port 8081)...
start "🟡 Auth Service - 8081" cmd /k "color 0E && cd Backend\auth-service && echo Démarrage Auth Service... && mvn spring-boot:run"
echo       ⏳ Attente 25 secondes pour Auth Service...
timeout /t 25 /nobreak >nul
echo       ✅ Auth Service démarré
echo.

REM ============================================
REM 4. API GATEWAY
REM ============================================
echo [4/5] 🟣 Démarrage API Gateway (Port 8080)...
start "🟣 API Gateway - 8080" cmd /k "color 0D && cd Backend\api-gateway && echo Démarrage API Gateway... && mvn spring-boot:run"
echo       ⏳ Attente 25 secondes pour API Gateway...
timeout /t 25 /nobreak >nul
echo       ✅ API Gateway démarré
echo.

REM ============================================
REM 5. FRONTEND ANGULAR
REM ============================================
echo [5/5] 🎨 Démarrage Frontend Angular (Port 4200)...
start "🎨 Frontend Angular - 4200" cmd /k "color 0C && cd Frontend\angular-app && echo Démarrage Frontend Angular... && ng serve"
echo       ⏳ Attente 15 secondes pour Angular...
timeout /t 15 /nobreak >nul
echo       ✅ Frontend Angular en cours de démarrage
echo.

REM ============================================
REM RÉSUMÉ
REM ============================================
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              ✅ TOUS LES SERVICES SONT LANCÉS ✅             ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📊 URLs importantes:
echo.
echo    🌐 Frontend:        http://localhost:4200
echo    🔌 API Gateway:     http://localhost:8080
echo    🔐 Auth Service:    http://localhost:8081
echo    📡 Eureka Dashboard: http://localhost:8761
echo    ⚙️  Config Server:   http://localhost:8888
echo.
echo 🧪 Tests rapides:
echo.
echo    Health Check:  curl http://localhost:8080/api/auth/health
echo    Eureka Status: curl http://localhost:8761/actuator/health
echo.
echo ⏰ Attendez 1-2 minutes que tous les services soient complètement démarrés
echo.
echo 💡 Conseil: Vérifiez Eureka Dashboard pour voir tous les services enregistrés
echo.

REM Demander si on veut ouvrir les URLs
echo Voulez-vous ouvrir les dashboards dans le navigateur? (O/N)
set /p OPEN_BROWSER="> "

if /i "%OPEN_BROWSER%"=="O" (
    echo.
    echo 🌐 Ouverture des dashboards...
    timeout /t 2 /nobreak >nul
    start http://localhost:8761
    timeout /t 2 /nobreak >nul
    start http://localhost:4200
    echo ✅ Dashboards ouverts
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   Appuyez sur une touche pour fermer cette fenêtre
echo   (Les services continueront à fonctionner en arrière-plan)
echo ═══════════════════════════════════════════════════════════════
pause >nul
