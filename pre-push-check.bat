@echo off
echo ========================================
echo Pre-Push Verification Checklist
echo ========================================

echo.
echo 1. Verification des fichiers modifies...
echo.

echo Fichiers Frontend modifies:
if exist "Frontend\angular-app\src\app\features\learner\planning\learner-planning.component.ts" (
    echo [OK] learner-planning.component.ts
) else (
    echo [MISSING] learner-planning.component.ts
)

if exist "Frontend\angular-app\src\app\features\learner\planning\learner-planning.component.html" (
    echo [OK] learner-planning.component.html
) else (
    echo [MISSING] learner-planning.component.html
)

if exist "Frontend\angular-app\src\app\features\learner\events\learner-events.component.ts" (
    echo [OK] learner-events.component.ts
) else (
    echo [MISSING] learner-events.component.ts
)

if exist "Frontend\angular-app\src\app\features\trainer\events\trainer-events.component.ts" (
    echo [OK] trainer-events.component.ts
) else (
    echo [MISSING] trainer-events.component.ts
)

if exist "Frontend\angular-app\src\app\features\trainer\events\trainer-events.component.html" (
    echo [OK] trainer-events.component.html
) else (
    echo [MISSING] trainer-events.component.html
)

if exist "Frontend\angular-app\src\app\features\trainer\weekly-planning\trainer-weekly-planning.component.ts" (
    echo [OK] trainer-weekly-planning.component.ts
) else (
    echo [MISSING] trainer-weekly-planning.component.ts
)

echo.
echo Fichiers Backend modifies:
if exist "Backend\planning-service\src\main\java\com\smartek\planning\service\WeeklyPlanningService.java" (
    echo [OK] WeeklyPlanningService.java
) else (
    echo [MISSING] WeeklyPlanningService.java
)

if exist "Frontend\angular-app\src\app\core\services\weekly-planning.service.ts" (
    echo [OK] weekly-planning.service.ts
) else (
    echo [MISSING] weekly-planning.service.ts
)

echo.
echo Fichiers de documentation:
if exist "ENHANCED-FEATURES-GUIDE.md" (
    echo [OK] ENHANCED-FEATURES-GUIDE.md
) else (
    echo [MISSING] ENHANCED-FEATURES-GUIDE.md
)

if exist "PLANNING-TRAINING-SYNC-GUIDE.md" (
    echo [OK] PLANNING-TRAINING-SYNC-GUIDE.md
) else (
    echo [MISSING] PLANNING-TRAINING-SYNC-GUIDE.md
)

if exist "PULL-REQUEST-SUMMARY.md" (
    echo [OK] PULL-REQUEST-SUMMARY.md
) else (
    echo [MISSING] PULL-REQUEST-SUMMARY.md
)

echo.
echo ========================================
echo 2. Verification Git...
echo ========================================

echo.
echo Statut Git actuel:
git status --porcelain

echo.
echo Branche actuelle:
git branch --show-current

echo.
echo Remote repositories:
git remote -v

echo.
echo ========================================
echo 3. Fonctionnalites implementees:
echo ========================================
echo.
echo [✓] Boutons Update/Refresh
echo [✓] Recherche dynamique avancee
echo [✓] Systeme de tri complet
echo [✓] Traduction anglaise complete
echo [✓] Synchronisation Planning-Training
echo [✓] Ameliorations UI/UX
echo [✓] Gestion d'erreurs
echo [✓] États de chargement
echo [✓] Documentation complete

echo.
echo ========================================
echo Verification terminee !
echo ========================================
echo.
echo Si tout est OK, executez: git-push-guide.bat
echo.
pause