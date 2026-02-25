@echo off
chcp 65001 >nul
color 0C

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              🛑 SMARTEK - Arrêt de tous les services         ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo ⚠️  Arrêt de tous les processus Java (Maven) et Node (Angular)...
echo.

REM Arrêter tous les processus Maven (Spring Boot)
echo 🔴 Arrêt des services Spring Boot...
taskkill /F /FI "WINDOWTITLE eq *Eureka Server*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Config Server*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Auth Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *API Gateway*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *Event Service*" 2>nul

REM Arrêter Angular
echo 🔴 Arrêt du Frontend Angular...
taskkill /F /FI "WINDOWTITLE eq *Frontend Angular*" 2>nul

REM Arrêter tous les processus Java Maven en cours
echo 🔴 Nettoyage des processus Maven...
taskkill /F /IM java.exe /FI "WINDOWTITLE eq *mvn*" 2>nul

REM Arrêter tous les processus Node Angular
echo 🔴 Nettoyage des processus Node...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *ng serve*" 2>nul

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              ✅ TOUS LES SERVICES SONT ARRÊTÉS ✅            ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 💡 Vous pouvez maintenant relancer les services avec start-all.bat
echo.
pause
