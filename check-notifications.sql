-- Script pour vérifier les notifications

USE offers_db;

-- Vérifier que la table existe
SHOW TABLES LIKE 'notifications';

-- Compter le nombre total de notifications
SELECT COUNT(*) as total_notifications FROM notifications;

-- Afficher toutes les notifications
SELECT 
    id,
    user_id,
    user_role,
    type,
    title,
    LEFT(message, 50) as message_preview,
    related_offer_id,
    is_read,
    created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 20;

-- Compter les notifications par utilisateur
SELECT 
    user_id,
    COUNT(*) as notification_count,
    SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count
FROM notifications
GROUP BY user_id;

-- Afficher les dernières offres créées
SELECT 
    id,
    title,
    company_name,
    status,
    created_at
FROM offers
ORDER BY created_at DESC
LIMIT 10;
