-- AlterTable
ALTER TABLE `battlepass_seasons_tasks` ADD COLUMN `period_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL') NOT NULL DEFAULT 'DAILY';

-- CreateTable
CREATE TABLE `battlepass_task_templates` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `task_img` VARCHAR(255) NULL,
    `task_type` ENUM('MONSTER_KILL', 'ITEM_GET', 'ITEM_USE', 'EXP', 'OFFER_MARKET', 'STORAGE') NOT NULL DEFAULT 'MONSTER_KILL',
    `period_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL') NOT NULL DEFAULT 'DAILY',
    `task_value` VARCHAR(255) NOT NULL DEFAULT '',
    `task_amount` INTEGER NOT NULL DEFAULT 1,
    `weight` INTEGER NOT NULL DEFAULT 1000,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `notes` TEXT NULL,
    `min_rank_access` ENUM('FREE', 'VIP_SILVER', 'VIP_GOLD', 'DIAMOND') NOT NULL DEFAULT 'FREE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
