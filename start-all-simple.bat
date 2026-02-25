@echo off
echo.
echo ========================================================
echo          SMARTEK - Starting All Services
echo ========================================================
echo.
echo Starting services in order...
echo.

REM 1. EUREKA SERVER
echo [1/7] Starting Eureka Server (Port 8761)...
start "Eureka Server - 8761" cmd /k "cd Backend\eureka-server && mvn spring-boot:run"
echo       Waiting 35 seconds for Eureka...
timeout /t 35 /nobreak >nul
echo       Eureka Server started
echo.

REM 2. CONFIG SERVER
echo [2/7] Starting Config Server (Port 8888)...
start "Config Server - 8888" cmd /k "cd Backend\config-server && mvn spring-boot:run"
echo       Waiting 25 seconds for Config Server...
timeout /t 25 /nobreak >nul
echo       Config Server started
echo.

REM 3. AUTH SERVICE
echo [3/7] Starting Auth Service (Port 8081)...
start "Auth Service - 8081" cmd /k "cd Backend\auth-service && mvn spring-boot:run"
echo       Waiting 25 seconds for Auth Service...
timeout /t 25 /nobreak >nul
echo       Auth Service started
echo.

REM 4. API GATEWAY
echo [4/7] Starting API Gateway (Port 8090)...
start "API Gateway - 8090" cmd /k "cd Backend\api-gateway && mvn spring-boot:run"
echo       Waiting 25 seconds for API Gateway...
timeout /t 25 /nobreak >nul
echo       API Gateway started
echo.

REM 5. EVENT SERVICE
echo [5/7] Starting Event Service (Port 8082)...
start "Event Service - 8082" cmd /k "cd Backend\event-service && mvn spring-boot:run"
echo       Waiting 25 seconds for Event Service...
timeout /t 25 /nobreak >nul
echo       Event Service started
echo.

REM 6. PLANNING SERVICE
echo [6/7] Starting Planning Service (Port 8083)...
start "Planning Service - 8083" cmd /k "cd Backend\planning-service && mvn spring-boot:run"
echo       Waiting 25 seconds for Planning Service...
timeout /t 25 /nobreak >nul
echo       Planning Service started
echo.

REM 7. FRONTEND ANGULAR
echo [7/7] Starting Frontend Angular (Port 4200)...
start "Frontend Angular - 4200" cmd /k "cd Frontend\angular-app && ng serve"
echo       Waiting 15 seconds for Angular...
timeout /t 15 /nobreak >nul
echo       Frontend Angular starting
echo.

echo.
echo ========================================================
echo          ALL SERVICES LAUNCHED
echo ========================================================
echo.
echo Important URLs:
echo.
echo    Frontend:         http://localhost:4200
echo    API Gateway:      http://localhost:8090
echo    Auth Service:     http://localhost:8081
echo    Event Service:    http://localhost:8082
echo    Planning Service: http://localhost:8083
echo    Eureka Dashboard: http://localhost:8761
echo    Config Server:    http://localhost:8888
echo.
echo Wait 1-2 minutes for all services to fully start
echo.
echo Press any key to close this window
echo (Services will continue running in background)
pause >nul
