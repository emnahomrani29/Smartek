@echo off
REM Script pour lancer tous les microservices SMARTEK avec les nouveaux ports
REM Ordre de démarrage: Eureka -> Config -> Gateway -> Services métier

echo ========================================
echo   Demarrage des microservices SMARTEK
echo ========================================
echo.

REM 1. Eureka Server (Service Discovery) - Port 8761
echo [1/10] Demarrage de Eureka Server (port 8761)...
start "Eureka Server" cmd /k "cd /d %~dp0Backend\eureka-server && mvn spring-boot:run"
timeout /t 30 /nobreak

REM 2. Config Server - Port 8888
echo [2/10] Demarrage de Config Server (port 8888)...
start "Config Server" cmd /k "cd /d %~dp0Backend\config-server && mvn spring-boot:run"
timeout /t 20 /nobreak

REM 3. API Gateway - Port 8090
echo [3/10] Demarrage de API Gateway (port 8090)...
start "API Gateway" cmd /k "cd /d %~dp0Backend\api-gateway && mvn spring-boot:run"
timeout /t 20 /nobreak

REM 4. Auth Service - Port 8081
echo [4/10] Demarrage de Auth Service (port 8081)...
start "Auth Service" cmd /k "cd /d %~dp0Backend\auth-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 5. Event Service - Port 8082
echo [5/10] Demarrage de Event Service (port 8082)...
start "Event Service" cmd /k "cd /d %~dp0Backend\event-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 6. Planning Service - Port 8083
echo [6/10] Demarrage de Planning Service (port 8083)...
start "Planning Service" cmd /k "cd /d %~dp0Backend\planning-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 7. Training Service - Port 8084
echo [7/10] Demarrage de Training Service (port 8084)...
start "Training Service" cmd /k "cd /d %~dp0Backend\training-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 8. Exam Service - Port 8085
echo [8/10] Demarrage de Exam Service (port 8085)...
start "Exam Service" cmd /k "cd /d %~dp0Backend\exam-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 9. Course Service - Port 8086
echo [9/10] Demarrage de Course Service (port 8086)...
start "Course Service" cmd /k "cd /d %~dp0Backend\course-service && mvn spring-boot:run"
timeout /t 15 /nobreak

REM 10. Offers Service - Port 8087
echo [10/10] Demarrage de Offers Service (port 8087)...
start "Offers Service" cmd /k "cd /d %~dp0Backend\offers-service && mvn spring-boot:run"

echo.
echo ========================================
echo   Tous les services sont en cours de demarrage!
echo ========================================
echo.
echo Configuration des ports:
echo   - Eureka Server: http://localhost:8761
echo   - Config Server: http://localhost:8888
echo   - API Gateway: http://localhost:8090
echo   - Auth Service: http://localhost:8081
echo   - Event Service: http://localhost:8082
echo   - Planning Service: http://localhost:8083
echo   - Training Service: http://localhost:8084
echo   - Exam Service: http://localhost:8085
echo   - Course Service: http://localhost:8086
echo   - Offers Service: http://localhost:8087
echo.
echo Attendez que tous les services soient completement demarres.
echo Pour arreter tous les services, utilisez stop-all-services.bat
pause