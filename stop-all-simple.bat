@echo off
echo.
echo ========================================================
echo          SMARTEK - Stopping All Services
echo ========================================================
echo.

echo Stopping all Java (Maven) and Node (Angular) processes...
echo.

REM Stop all Spring Boot services
echo Stopping Spring Boot services...
taskkill /F /FI "WINDOWTITLE eq *Eureka Server*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Config Server*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Auth Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *API Gateway*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Event Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Planning Service*" 2>nul

REM Stop Angular
echo Stopping Frontend Angular...
taskkill /F /FI "WINDOWTITLE eq *Frontend Angular*" 2>nul

REM Clean up Maven processes
echo Cleaning Maven processes...
taskkill /F /IM java.exe /FI "WINDOWTITLE eq *mvn*" 2>nul

REM Clean up Node processes
echo Cleaning Node processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *ng serve*" 2>nul

echo.
echo ========================================================
echo          ALL SERVICES STOPPED
echo ========================================================
echo.
echo You can restart services with start-all-simple.bat
echo.
pause
