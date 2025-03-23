-- CreateTable
CREATE TABLE `character_market` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `world_id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(40) NOT NULL,
    `level` INTEGER NOT NULL,
    `vocation` TINYINT NOT NULL DEFAULT 1,
    `price` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `status` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
