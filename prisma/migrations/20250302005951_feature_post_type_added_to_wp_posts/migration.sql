-- AlterTable
ALTER TABLE `wp_posts` ADD COLUMN `type` ENUM('INFO', 'UPDATE', 'ALERT', 'CRITICAL', 'EVENT') NOT NULL DEFAULT 'INFO';
