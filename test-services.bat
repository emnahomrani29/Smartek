@echo off
chcp 65001 >nul
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         🧪 Test de Compilation des Services SMARTEK          ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Test Eureka Server...
cd Backend\eureka-server
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Eureka Server - ÉCHEC
    pause
    exit /b 1
) else (
    echo ✅ Eureka Server - OK
)
cd ..\..
echo.

echo [2/4] Test Config Server...
cd Backend\config-server
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Config Server - ÉCHEC
    pause
    exit /b 1
) else (
    echo ✅ Config Server - OK
)
cd ..\..
echo.

echo [3/4] Test API Gateway...
cd Backend\api-gateway
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ❌ API Gateway - ÉCHEC
    pause
    exit /b 1
) else (
    echo ✅ API Gateway - OK
)
cd ..\..
echo.

echo [4/4] Test Auth Service...
cd Backend\auth-service
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ❌ Auth Service - ÉCHEC
    pause
    exit /b 1
) else (
    echo ✅ Auth Service - OK
)
cd ..\..
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         ✅ TOUS LES SERVICES COMPILENT CORRECTEMENT ✅       ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Vous pouvez maintenant lancer start-all.bat
echo.
pause
