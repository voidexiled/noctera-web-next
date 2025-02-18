-- CreateTable
CREATE TABLE `battlepass_seasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_number` VARCHAR(255) NOT NULL,
    `season_name` VARCHAR(255) NOT NULL,
    `date_start` DATETIME(0) NOT NULL,
    `date_end` DATETIME(0) NOT NULL,
    `background_img` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `battlepass_seasons_season_number_key`(`season_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battlepass_seasons_rewards` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `reward_name` VARCHAR(255) NOT NULL,
    `reward_img` VARCHAR(255) NOT NULL,
    `reward_type` ENUM('ITEM', 'MONEY', 'EXP', 'COINS', 'COINS_TRANSFERABLE', 'VIP_DAYS', 'OUTFIT', 'MOUNT', 'STORAGE') NOT NULL DEFAULT 'ITEM',
    `reward_amount` INTEGER NOT NULL DEFAULT 1,
    `reward_value` INTEGER NOT NULL DEFAULT 0,
    `reward_should_plus_amount` BOOLEAN NOT NULL DEFAULT false,
    `reward_required_access` ENUM('FREE', 'VIP_SILVER', 'VIP_GOLD', 'DIAMOND') NOT NULL DEFAULT 'FREE',
    `description` TEXT NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    INDEX `season_id`(`season_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `battlepass_seasons_tasks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `task_img` VARCHAR(255) NOT NULL,
    `task_type` ENUM('MONSTER_KILL', 'ITEM_GET', 'ITEM_USE', 'EXP', 'OFFER_MARKET', 'STORAGE') NOT NULL DEFAULT 'MONSTER_KILL',
    `task_value` VARCHAR(255) NOT NULL DEFAULT '',
    `task_amount` INTEGER NOT NULL DEFAULT 1,
    `task_battlepass_exp_reward` INTEGER NOT NULL DEFAULT 0,
    `available_from` DATETIME(0) NOT NULL,

    INDEX `season_id`(`season_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_battlepass_rewards_claimed` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `reward_id` INTEGER UNSIGNED NOT NULL,
    `claimed_at` DATETIME(0) NOT NULL,

    INDEX `season_id`(`season_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_battlepass_progress` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `current_exp` INTEGER UNSIGNED NOT NULL,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_battlepass_tasks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `task_id` INTEGER UNSIGNED NOT NULL,
    `current_amount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `claimed` BOOLEAN NOT NULL DEFAULT false,
    `finished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `battlepass_seasons_rewards` ADD CONSTRAINT `battlepass_seasons_rewards_seasons_fk` FOREIGN KEY (`season_id`) REFERENCES `battlepass_seasons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `battlepass_seasons_tasks` ADD CONSTRAINT `battlepass_seasons_tasks_seasons_fk` FOREIGN KEY (`season_id`) REFERENCES `battlepass_seasons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_rewards_claimed` ADD CONSTRAINT `player_battlepass_rewards_claimed_seasons_fk` FOREIGN KEY (`season_id`) REFERENCES `battlepass_seasons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_rewards_claimed` ADD CONSTRAINT `player_battlepass_rewards_claimed_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_rewards_claimed` ADD CONSTRAINT `player_battlepass_rewards_claimed_rewards_fk` FOREIGN KEY (`reward_id`) REFERENCES `battlepass_seasons_rewards`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_progress` ADD CONSTRAINT `battlepass_seasons_tasks_seasons_fk1` FOREIGN KEY (`season_id`) REFERENCES `battlepass_seasons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_progress` ADD CONSTRAINT `player_battlepass_progress_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_tasks` ADD CONSTRAINT `player_battlepass_tasks_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_tasks` ADD CONSTRAINT `player_battlepass_tasks_seasons_fk` FOREIGN KEY (`season_id`) REFERENCES `battlepass_seasons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_battlepass_tasks` ADD CONSTRAINT `player_battlepass_tasks_tasks_fk` FOREIGN KEY (`task_id`) REFERENCES `battlepass_seasons_tasks`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
