-- ============================================
-- Script complet pour corriger la table applications
-- ============================================

USE offers_db;

-- Afficher la structure actuelle
SELECT 'Structure AVANT modification:' as '';
DESCRIBE applications;

-- Corriger la colonne applied_at pour avoir DEFAULT CURRENT_TIMESTAMP
ALTER TABLE applications 
MODIFY COLUMN applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Afficher la structure après modification
SELECT '' as '';
SELECT 'Structure APRÈS modification:' as '';
DESCRIBE applications;

-- Afficher les candidatures existantes
SELECT '' as '';
SELECT 'Candidatures existantes:' as '';
SELECT id, offer_id, learner_id, learner_name, status, applied_at 
FROM applications;

-- Compter les candidatures
SELECT '' as '';
SELECT CONCAT('Total candidatures: ', COUNT(*)) as 'Résumé'
FROM applications;

SELECT 'Script exécuté avec succès! Vous pouvez maintenant redémarrer offers-service.' as '';
