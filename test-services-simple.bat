@echo off
echo.
echo ========================================================
echo          SMARTEK - Testing All Services
echo ========================================================
echo.

echo Testing service endpoints...
echo.

echo [1/7] Testing Eureka Server (8761)...
curl -s http://localhost:8761/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Eureka Server is running
) else (
    echo       [FAIL] Eureka Server is not responding
)
echo.

echo [2/7] Testing Config Server (8888)...
curl -s http://localhost:8888/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Config Server is running
) else (
    echo       [FAIL] Config Server is not responding
)
echo.

echo [3/7] Testing Auth Service (8081)...
curl -s http://localhost:8081/api/auth/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Auth Service is running
) else (
    echo       [FAIL] Auth Service is not responding
)
echo.

echo [4/7] Testing API Gateway (8090)...
curl -s http://localhost:8090/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] API Gateway is running
) else (
    echo       [FAIL] API Gateway is not responding
)
echo.

echo [5/7] Testing Event Service (8082)...
curl -s http://localhost:8082/events/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Event Service is running
) else (
    echo       [FAIL] Event Service is not responding
)
echo.

echo [6/7] Testing Planning Service (8083)...
curl -s http://localhost:8083/plannings/health >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Planning Service is running
) else (
    echo       [FAIL] Planning Service is not responding
)
echo.

echo [7/7] Testing Frontend Angular (4200)...
curl -s http://localhost:4200 >nul 2>&1
if %errorlevel% equ 0 (
    echo       [OK] Frontend Angular is running
) else (
    echo       [FAIL] Frontend Angular is not responding
)
echo.

echo ========================================================
echo          Service Test Complete
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
pause
