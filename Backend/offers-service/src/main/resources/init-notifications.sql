-- Utiliser la base de données offers_db
USE offers_db;

-- Supprimer la table si elle existe déjà (pour réinitialisation)
DROP TABLE IF EXISTS notifications;

-- Créer la table notifications
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    related_offer_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_user_id_is_read (user_id, is_read),
    INDEX idx_created_at (created_at)
);

-- Vérifier que la table a été créée
SHOW TABLES LIKE 'notifications';

-- Afficher la structure de la table
DESCRIBE notifications;
