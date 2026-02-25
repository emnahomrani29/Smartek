-- Run this in your MySQL database to create the tables manually

USE smartek_db;

-- Drop tables if they exist (to start fresh)
DROP TABLE IF EXISTS earned_certification;
DROP TABLE IF EXISTS earned_badge;
DROP TABLE IF EXISTS certification_template;
DROP TABLE IF EXISTS badge_template;

-- Create badge_template table
CREATE TABLE badge_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create certification_template table
CREATE TABLE certification_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create earned_badge table
CREATE TABLE earned_badge (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    badge_template_id BIGINT NOT NULL,
    learner_id BIGINT NOT NULL,
    earned_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    awarded_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (badge_template_id) REFERENCES badge_template(id),
    INDEX idx_learner_id (learner_id),
    INDEX idx_badge_template_id (badge_template_id),
    INDEX idx_earned_date (earned_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create earned_certification table
CREATE TABLE earned_certification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certification_template_id BIGINT NOT NULL,
    learner_id BIGINT NOT NULL,
    issued_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NULL,
    issued_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certification_template_id) REFERENCES certification_template(id),
    INDEX idx_learner_id (learner_id),
    INDEX idx_certification_template_id (certification_template_id),
    INDEX idx_issued_date (issued_date),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify tables were created
SHOW TABLES;
