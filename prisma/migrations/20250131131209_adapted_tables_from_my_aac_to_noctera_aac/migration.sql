/*
  Warnings:

  - Added the required column `description` to the `guilds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `authToken` VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN `email_code` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `email_hash` VARCHAR(32) NOT NULL DEFAULT '',
    ADD COLUMN `email_new` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `email_new_time` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `email_next` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `gamesecret` CHAR(16) NULL,
    ADD COLUMN `web_flags` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `guilds` ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `logo_name` VARCHAR(255) NOT NULL DEFAULT 'default.gif';

-- AlterTable
ALTER TABLE `players` ADD COLUMN `battlepass_rank` ENUM('FREE', 'VIP_SILVER', 'VIP_GOLD', 'DIAMOND') NOT NULL DEFAULT 'FREE',
    ADD COLUMN `cast_on` TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN `comment` TEXT NOT NULL,
    ADD COLUMN `hidden` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ismain` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `wp_social_medias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `instagram` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `twitch` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `wp_social_medias_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `content` LONGTEXT NOT NULL,
    `cover` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `category` ENUM('BLOG', 'TICKER', 'ROADMAP') NOT NULL DEFAULT 'BLOG',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `wp_posts_slug_key`(`slug`),
    INDEX `wp_posts_account_id_fkey`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_products_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `img_url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,
    `content` TINYTEXT NOT NULL,
    `slug` VARCHAR(100) NULL,
    `img_url` VARCHAR(191) NULL,
    `price` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `wp_products_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_products_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `status` ENUM('PROCESSING', 'PENDING', 'CANCELED', 'DELIVERED') NOT NULL DEFAULT 'PROCESSING',
    `provider` VARCHAR(100) NULL,
    `currency` VARCHAR(191) NOT NULL,
    `total_amount` VARCHAR(191) NOT NULL,
    `orderID` VARCHAR(191) NOT NULL,
    `payerID` VARCHAR(191) NULL,
    `paymentID` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isValid` BOOLEAN NOT NULL DEFAULT false,
    `account_id` INTEGER UNSIGNED NULL,

    INDEX `wp_tokens_account_id_fkey`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wp_social_medias` ADD CONSTRAINT `wp_social_medias_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_posts` ADD CONSTRAINT `wp_posts_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_products` ADD CONSTRAINT `wp_products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `wp_products_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_tokens` ADD CONSTRAINT `wp_tokens_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
