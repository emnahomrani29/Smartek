-- Script pour vérifier les candidatures

USE offers_db;

-- Voir toutes les candidatures
SELECT * FROM applications;

-- Compter les candidatures par learner
SELECT learner_id, COUNT(*) as count
FROM applications
GROUP BY learner_id;

-- Compter les candidatures par offre
SELECT offer_id, COUNT(*) as count
FROM applications
GROUP BY offer_id;

-- Voir les candidatures du learner ID 1
SELECT * FROM applications WHERE learner_id = 1;

-- Supprimer toutes les candidatures du learner ID 1 (pour retester)
-- DELETE FROM applications WHERE learner_id = 1;
