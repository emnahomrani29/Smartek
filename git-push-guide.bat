@echo off
echo ========================================
echo Git Push Guide - Event/Planning Service
echo ========================================

echo.
echo 1. Verification du statut Git...
git status

echo.
echo 2. Ajout de tous les fichiers modifies...
git add .

echo.
echo 3. Verification des fichiers ajoutes...
git status

echo.
echo 4. Commit des modifications...
git commit -m "feat: Enhanced Planning & Events with advanced features

- Added update/refresh buttons for real-time data sync
- Implemented advanced dynamic search across all fields
- Added comprehensive sorting system (time, title, type, location, availability)
- Complete English translation for international accessibility
- Enhanced trainer events management with filtering and sorting
- Improved trainer weekly planning with advanced controls
- Added synchronization between planning and training services
- Enhanced UI/UX with better visual feedback and loading states
- Added results summary and improved empty states
- Implemented business logic for planning-training integration

Features:
- Dynamic search and filtering
- Multi-criteria sorting with visual indicators
- Real-time updates and refresh functionality
- English localization
- Enhanced user experience
- Planning-Training service synchronization"

echo.
echo 5. Verification de la branche actuelle...
git branch

echo.
echo 6. Creation/Switch vers la branche event/planning-service...
git checkout -b event/planning-service

echo.
echo 7. Configuration du remote origin (si necessaire)...
git remote -v
git remote set-url origin https://github.com/emnahomrani29/Esprit-PI-4SAE1-2026-Smartek.git

echo.
echo 8. Push vers la branche event/planning-service...
git push -u origin event/planning-service

echo.
echo ========================================
echo Push termine avec succes !
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Aller sur GitHub: https://github.com/emnahomrani29/Esprit-PI-4SAE1-2026-Smartek
echo 2. Creer une Pull Request depuis event/planning-service vers main
echo 3. Ajouter une description detaillee des modifications
echo 4. Demander une review si necessaire
echo.
pause