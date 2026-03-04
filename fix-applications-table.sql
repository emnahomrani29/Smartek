-- ============================================
-- Script pour corriger la table applications
-- ============================================
-- INSTRUCTIONS:
-- 1. Ouvrez MySQL Workbench ou votre client MySQL
-- 2. Connectez-vous à votre serveur MySQL
-- 3. Exécutez ce script complet
-- 4. Redémarrez le service offers-service après l'exécution
-- ============================================

USE offers_db;

-- Modifier la colonne applied_at pour avoir une valeur par défaut
ALTER TABLE applications 
MODIFY COLUMN applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Vérifier la structure de la table (vous devriez voir applied_at avec DEFAULT CURRENT_TIMESTAMP)
DESCRIBE applications;

-- Afficher les candidatures existantes (devrait être vide ou montrer les anciennes candidatures)
SELECT * FROM applications;
