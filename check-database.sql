-- Run these SQL commands in your MySQL database to check if tables exist

USE smartek_db;

-- Check if certification_template table exists
SHOW TABLES LIKE 'certification_template';

-- Check the structure
DESCRIBE certification_template;

-- Check if badge_template table exists
SHOW TABLES LIKE 'badge_template';

-- Check the structure
DESCRIBE badge_template;

-- Check Flyway migration history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
