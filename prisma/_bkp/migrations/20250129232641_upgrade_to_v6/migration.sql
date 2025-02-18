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
CREATE TABLE `account_ban_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `banned_at` BIGINT NOT NULL,
    `expired_at` BIGINT NOT NULL,
    `banned_by` INTEGER NOT NULL,

    INDEX `account_id`(`account_id`),
    INDEX `banned_by`(`banned_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_bans` (
    `account_id` INTEGER UNSIGNED NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `banned_at` BIGINT NOT NULL,
    `expires_at` BIGINT NOT NULL,
    `banned_by` INTEGER NOT NULL,

    INDEX `banned_by`(`banned_by`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `expires` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_vipgrouplist` (
    `account_id` INTEGER UNSIGNED NOT NULL,
    `player_id` INTEGER NOT NULL,
    `vipgroup_id` INTEGER UNSIGNED NOT NULL,

    INDEX `account_id`(`account_id`),
    INDEX `account_vipgrouplist_vipgroup_fk`(`vipgroup_id`, `account_id`),
    INDEX `player_id`(`player_id`),
    INDEX `vipgroup_id`(`vipgroup_id`),
    UNIQUE INDEX `account_vipgrouplist_unique`(`account_id`, `player_id`, `vipgroup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_vipgroups` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `customizable` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`, `account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_viplist` (
    `account_id` INTEGER UNSIGNED NOT NULL,
    `player_id` INTEGER NOT NULL,
    `description` VARCHAR(128) NOT NULL DEFAULT '',
    `icon` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `notify` BOOLEAN NOT NULL DEFAULT false,

    INDEX `account_id`(`account_id`),
    INDEX `player_id`(`player_id`),
    UNIQUE INDEX `account_viplist_unique`(`account_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `password` TEXT NOT NULL,
    `email` VARCHAR(255) NOT NULL DEFAULT '',
    `created` INTEGER NOT NULL DEFAULT 0,
    `rlname` VARCHAR(255) NOT NULL DEFAULT '',
    `location` VARCHAR(255) NOT NULL DEFAULT '',
    `country` VARCHAR(3) NOT NULL DEFAULT '',
    `web_lastlogin` INTEGER NOT NULL DEFAULT 0,
    `web_flags` INTEGER NOT NULL DEFAULT 0,
    `email_hash` VARCHAR(32) NOT NULL DEFAULT '',
    `email_new` VARCHAR(255) NOT NULL DEFAULT '',
    `email_new_time` INTEGER NOT NULL DEFAULT 0,
    `email_code` VARCHAR(255) NOT NULL DEFAULT '',
    `email_next` INTEGER NOT NULL DEFAULT 0,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `phone` VARCHAR(15) NULL,
    `key` VARCHAR(64) NOT NULL DEFAULT '',
    `premdays` INTEGER NOT NULL DEFAULT 0,
    `premdays_purchased` INTEGER NOT NULL DEFAULT 0,
    `lastday` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `type` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `coins` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `coins_transferable` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `tournament_coins` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `creation` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `recruiter` INTEGER NULL DEFAULT 0,
    `vote` INTEGER NOT NULL DEFAULT 0,
    `secret_status` BOOLEAN NOT NULL DEFAULT false,
    `secret` CHAR(16) NULL,
    `gamesecret` CHAR(16) NULL,
    `authToken` VARCHAR(100) NOT NULL DEFAULT '',

    UNIQUE INDEX `accounts_unique`(`name`),
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

-- CreateTable
CREATE TABLE `boosted_boss` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boostname` TEXT NULL,
    `date` VARCHAR(250) NOT NULL DEFAULT '',
    `raceid` VARCHAR(250) NOT NULL DEFAULT '',
    `looktypeEx` INTEGER NOT NULL DEFAULT 0,
    `looktype` INTEGER NOT NULL DEFAULT 136,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookaddons` INTEGER NOT NULL DEFAULT 0,
    `lookmount` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boosted_creature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boostname` TEXT NULL,
    `date` VARCHAR(250) NOT NULL DEFAULT '',
    `raceid` VARCHAR(250) NOT NULL DEFAULT '',
    `looktype` INTEGER NOT NULL DEFAULT 136,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookaddons` INTEGER NOT NULL DEFAULT 0,
    `lookmount` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coins_transactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `type` TINYINT UNSIGNED NOT NULL,
    `coin_type` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `amount` INTEGER UNSIGNED NOT NULL,
    `description` VARCHAR(3500) NOT NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `account_id`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_reward_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `daystreak` SMALLINT NOT NULL DEFAULT 0,
    `player_id` INTEGER NOT NULL,
    `timestamp` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forge_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `action_type` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    `is_success` TINYINT NOT NULL DEFAULT 0,
    `bonus` TINYINT NOT NULL DEFAULT 0,
    `done_at` BIGINT NOT NULL,
    `done_at_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cost` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `gained` BIGINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `global_storage` (
    `key` VARCHAR(32) NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `global_storage_unique`(`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_invites` (
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `guild_id` INTEGER NOT NULL DEFAULT 0,
    `date` INTEGER NOT NULL,

    INDEX `guild_id`(`guild_id`),
    PRIMARY KEY (`player_id`, `guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_membership` (
    `player_id` INTEGER NOT NULL,
    `guild_id` INTEGER NOT NULL,
    `rank_id` INTEGER NOT NULL,
    `nick` VARCHAR(15) NOT NULL DEFAULT '',

    INDEX `guild_id`(`guild_id`),
    INDEX `rank_id`(`rank_id`),
    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_ranks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `level` INTEGER NOT NULL,

    INDEX `guild_id`(`guild_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_wars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild1` INTEGER NOT NULL DEFAULT 0,
    `guild2` INTEGER NOT NULL DEFAULT 0,
    `name1` VARCHAR(255) NOT NULL,
    `name2` VARCHAR(255) NOT NULL,
    `status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `started` BIGINT NOT NULL DEFAULT 0,
    `ended` BIGINT NOT NULL DEFAULT 0,
    `frags_limit` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `payment` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `duration_days` TINYINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `guild1`(`guild1`),
    INDEX `guild2`(`guild2`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NOT NULL,
    `ownerid` INTEGER NOT NULL,
    `creationdata` INTEGER NOT NULL,
    `motd` VARCHAR(255) NOT NULL DEFAULT '',
    `residence` INTEGER NOT NULL DEFAULT 0,
    `balance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NOT NULL,
    `logo_name` VARCHAR(255) NOT NULL DEFAULT 'default.gif',

    UNIQUE INDEX `guilds_name_unique`(`name`),
    UNIQUE INDEX `guilds_owner_unique`(`ownerid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guildwar_kills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `killer` VARCHAR(50) NOT NULL,
    `target` VARCHAR(50) NOT NULL,
    `killerguild` INTEGER NOT NULL DEFAULT 0,
    `targetguild` INTEGER NOT NULL DEFAULT 0,
    `warid` INTEGER NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    INDEX `warid`(`warid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `house_lists` (
    `house_id` INTEGER NOT NULL,
    `listid` INTEGER NOT NULL,
    `version` BIGINT NOT NULL DEFAULT 0,
    `list` TEXT NOT NULL,

    INDEX `house_id_index`(`house_id`),
    INDEX `version`(`version`),
    PRIMARY KEY (`house_id`, `listid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `houses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner` INTEGER NOT NULL,
    `new_owner` INTEGER NOT NULL DEFAULT -1,
    `paid` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `warnings` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(255) NOT NULL,
    `rent` INTEGER NOT NULL DEFAULT 0,
    `town_id` INTEGER NOT NULL DEFAULT 0,
    `bid` INTEGER NOT NULL DEFAULT 0,
    `bid_end` INTEGER NOT NULL DEFAULT 0,
    `last_bid` INTEGER NOT NULL DEFAULT 0,
    `highest_bidder` INTEGER NOT NULL DEFAULT 0,
    `size` INTEGER NOT NULL DEFAULT 0,
    `guildid` INTEGER NULL,
    `beds` INTEGER NOT NULL DEFAULT 0,

    INDEX `owner`(`owner`),
    INDEX `town_id`(`town_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ip_bans` (
    `ip` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `banned_at` BIGINT NOT NULL,
    `expires_at` BIGINT NOT NULL,
    `banned_by` INTEGER NOT NULL,

    INDEX `banned_by`(`banned_by`),
    PRIMARY KEY (`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kv_store` (
    `key_name` VARCHAR(191) NOT NULL,
    `timestamp` BIGINT NOT NULL,
    `value` LONGBLOB NOT NULL,

    PRIMARY KEY (`key_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `market_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `sale` BOOLEAN NOT NULL DEFAULT false,
    `itemtype` INTEGER UNSIGNED NOT NULL,
    `amount` SMALLINT UNSIGNED NOT NULL,
    `price` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `expires_at` BIGINT UNSIGNED NOT NULL,
    `inserted` BIGINT UNSIGNED NOT NULL,
    `state` TINYINT UNSIGNED NOT NULL,
    `tier` TINYINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `player_id`(`player_id`, `sale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `market_offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `sale` BOOLEAN NOT NULL DEFAULT false,
    `itemtype` INTEGER UNSIGNED NOT NULL,
    `amount` SMALLINT UNSIGNED NOT NULL,
    `created` BIGINT UNSIGNED NOT NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT false,
    `price` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `tier` TINYINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `created`(`created`),
    INDEX `player_id`(`player_id`),
    INDEX `sale`(`sale`, `itemtype`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_account_actions` (
    `account_id` INTEGER NOT NULL,
    `ip` VARCHAR(16) NOT NULL DEFAULT '0.0.0.0',
    `ipv6` BINARY(16) NOT NULL DEFAULT ('0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),
    `date` INTEGER NOT NULL DEFAULT 0,
    `action` VARCHAR(255) NOT NULL DEFAULT '',
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `account_id`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_admin_menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `page` VARCHAR(255) NOT NULL DEFAULT '',
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `flags` INTEGER NOT NULL DEFAULT 0,
    `enabled` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_bugtracker` (
    `account` VARCHAR(255) NOT NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 0,
    `text` TEXT NOT NULL,
    `id` INTEGER NOT NULL DEFAULT 0,
    `subject` VARCHAR(255) NOT NULL DEFAULT '',
    `reply` INTEGER NOT NULL DEFAULT 0,
    `who` INTEGER NOT NULL DEFAULT 0,
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_changelog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(500) NOT NULL DEFAULT '',
    `type` BOOLEAN NOT NULL DEFAULT false,
    `where` BOOLEAN NOT NULL DEFAULT false,
    `date` INTEGER NOT NULL DEFAULT 0,
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_charbazaar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_old` INTEGER NOT NULL,
    `account_new` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `date_end` DATETIME(0) NOT NULL,
    `date_start` DATETIME(0) NOT NULL,
    `bid_account` INTEGER NOT NULL,
    `bid_price` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_charbazaar_bid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `auction_id` INTEGER NOT NULL,
    `bid` INTEGER NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `value` VARCHAR(1000) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL DEFAULT '',
    `answer` VARCHAR(1020) NOT NULL DEFAULT '',
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_forum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_post` INTEGER NOT NULL DEFAULT 0,
    `last_post` INTEGER NOT NULL DEFAULT 0,
    `section` INTEGER NOT NULL DEFAULT 0,
    `replies` INTEGER NOT NULL DEFAULT 0,
    `views` INTEGER NOT NULL DEFAULT 0,
    `author_aid` INTEGER NOT NULL DEFAULT 0,
    `author_guid` INTEGER NOT NULL DEFAULT 0,
    `post_text` TEXT NOT NULL,
    `post_topic` VARCHAR(255) NOT NULL DEFAULT '',
    `post_smile` BOOLEAN NOT NULL DEFAULT false,
    `post_html` BOOLEAN NOT NULL DEFAULT false,
    `post_date` INTEGER NOT NULL DEFAULT 0,
    `last_edit_aid` INTEGER NOT NULL DEFAULT 0,
    `edit_date` INTEGER NOT NULL DEFAULT 0,
    `post_ip` VARCHAR(32) NOT NULL DEFAULT '0.0.0.0',
    `sticked` BOOLEAN NOT NULL DEFAULT false,
    `closed` BOOLEAN NOT NULL DEFAULT false,

    INDEX `section`(`section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_forum_boards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `description` VARCHAR(255) NOT NULL DEFAULT '',
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `guild` INTEGER NOT NULL DEFAULT 0,
    `access` INTEGER NOT NULL DEFAULT 0,
    `closed` BOOLEAN NOT NULL DEFAULT false,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment` VARCHAR(255) NOT NULL DEFAULT '',
    `image` VARCHAR(255) NOT NULL,
    `thumb` VARCHAR(255) NOT NULL,
    `author` VARCHAR(50) NOT NULL DEFAULT '',
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `template` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `blank` BOOLEAN NOT NULL DEFAULT false,
    `color` VARCHAR(6) NOT NULL DEFAULT '',
    `category` INTEGER NOT NULL DEFAULT 1,
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `enabled` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_monsters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(255) NOT NULL,
    `mana` INTEGER NOT NULL DEFAULT 0,
    `exp` INTEGER NOT NULL,
    `health` INTEGER NOT NULL,
    `speed_lvl` INTEGER NOT NULL DEFAULT 1,
    `use_haste` BOOLEAN NOT NULL,
    `voices` TEXT NOT NULL,
    `immunities` VARCHAR(255) NOT NULL,
    `elements` TEXT NOT NULL,
    `summonable` BOOLEAN NOT NULL,
    `convinceable` BOOLEAN NOT NULL,
    `pushable` BOOLEAN NOT NULL DEFAULT false,
    `canpushitems` BOOLEAN NOT NULL DEFAULT false,
    `canwalkonenergy` BOOLEAN NOT NULL DEFAULT false,
    `canwalkonpoison` BOOLEAN NOT NULL DEFAULT false,
    `canwalkonfire` BOOLEAN NOT NULL DEFAULT false,
    `runonhealth` BOOLEAN NOT NULL DEFAULT false,
    `hostile` BOOLEAN NOT NULL DEFAULT false,
    `attackable` BOOLEAN NOT NULL DEFAULT false,
    `rewardboss` BOOLEAN NOT NULL DEFAULT false,
    `defense` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `canpushcreatures` BOOLEAN NOT NULL DEFAULT false,
    `race` VARCHAR(255) NOT NULL,
    `loot` TEXT NOT NULL,
    `summons` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `body` TEXT NOT NULL,
    `type` BOOLEAN NOT NULL DEFAULT false,
    `date` INTEGER NOT NULL DEFAULT 0,
    `category` BOOLEAN NOT NULL DEFAULT false,
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `last_modified_by` INTEGER NOT NULL DEFAULT 0,
    `last_modified_date` INTEGER NOT NULL DEFAULT 0,
    `comments` VARCHAR(50) NOT NULL DEFAULT '',
    `article_text` VARCHAR(300) NOT NULL DEFAULT '',
    `article_image` VARCHAR(100) NOT NULL DEFAULT '',
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_news_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL DEFAULT '',
    `description` VARCHAR(50) NOT NULL DEFAULT '',
    `icon_id` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_notepad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `title` VARCHAR(30) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `php` BOOLEAN NOT NULL DEFAULT false,
    `enable_tinymce` BOOLEAN NOT NULL DEFAULT true,
    `access` TINYINT NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_polls` (
    `id` INTEGER NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `end` INTEGER NOT NULL,
    `start` INTEGER NOT NULL,
    `answers` INTEGER NOT NULL,
    `votes_all` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_polls_answers` (
    `poll_id` INTEGER NOT NULL,
    `answer_id` INTEGER NOT NULL,
    `answer` VARCHAR(255) NOT NULL,
    `votes` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_send_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_code` VARCHAR(50) NOT NULL,
    `item_id` VARCHAR(20) NOT NULL,
    `item_name` VARCHAR(50) NOT NULL,
    `item_count` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(50) NOT NULL,
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `request` LONGTEXT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `myaac_send_items_account_fk`(`account_id`),
    INDEX `payment_method`(`payment_method`),
    INDEX `payment_status`(`payment_status`),
    INDEX `status`(`status`),
    UNIQUE INDEX `transaction_code`(`transaction_code`, `payment_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_spells` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `spell` VARCHAR(255) NOT NULL DEFAULT '',
    `name` VARCHAR(255) NOT NULL,
    `words` VARCHAR(255) NOT NULL DEFAULT '',
    `category` BOOLEAN NOT NULL DEFAULT false,
    `type` BOOLEAN NOT NULL DEFAULT false,
    `level` INTEGER NOT NULL DEFAULT 0,
    `maglevel` INTEGER NOT NULL DEFAULT 0,
    `mana` INTEGER NOT NULL DEFAULT 0,
    `soul` TINYINT NOT NULL DEFAULT 0,
    `conjure_id` INTEGER NOT NULL DEFAULT 0,
    `conjure_count` TINYINT NOT NULL DEFAULT 0,
    `reagent` INTEGER NOT NULL DEFAULT 0,
    `item_id` INTEGER NOT NULL DEFAULT 0,
    `premium` BOOLEAN NOT NULL DEFAULT false,
    `vocations` VARCHAR(100) NOT NULL DEFAULT '',
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL DEFAULT '',
    `youtube_id` VARCHAR(20) NOT NULL,
    `author` VARCHAR(50) NOT NULL DEFAULT '',
    `ordering` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_visitors` (
    `ip` VARCHAR(45) NOT NULL,
    `lastvisit` INTEGER NOT NULL DEFAULT 0,
    `page` VARCHAR(2048) NOT NULL,

    UNIQUE INDEX `ip`(`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `myaac_weapons` (
    `id` INTEGER NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 0,
    `maglevel` INTEGER NOT NULL DEFAULT 0,
    `vocations` VARCHAR(100) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagseguro_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_code` VARCHAR(50) NOT NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(50) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `coins_amount` INTEGER NOT NULL,
    `bought` INTEGER NULL,
    `delivered` CHAR(1) NOT NULL DEFAULT '0',
    `in_double` CHAR(1) NOT NULL DEFAULT '0',
    `request` LONGTEXT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `coins_amount`(`coins_amount`),
    INDEX `delivered`(`delivered`),
    INDEX `pagseguro_transactions_account_fk`(`account_id`),
    INDEX `payment_method`(`payment_method`),
    INDEX `payment_status`(`payment_status`),
    UNIQUE INDEX `transaction_code`(`transaction_code`, `payment_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_bosstiary` (
    `player_id` INTEGER NOT NULL,
    `bossIdSlotOne` INTEGER NOT NULL DEFAULT 0,
    `bossIdSlotTwo` INTEGER NOT NULL DEFAULT 0,
    `removeTimes` INTEGER NOT NULL DEFAULT 1,
    `tracker` BLOB NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_charms` (
    `player_guid` INTEGER NOT NULL,
    `charm_points` VARCHAR(250) NULL,
    `charm_expansion` BOOLEAN NULL,
    `rune_wound` INTEGER NULL,
    `rune_enflame` INTEGER NULL,
    `rune_poison` INTEGER NULL,
    `rune_freeze` INTEGER NULL,
    `rune_zap` INTEGER NULL,
    `rune_curse` INTEGER NULL,
    `rune_cripple` INTEGER NULL,
    `rune_parry` INTEGER NULL,
    `rune_dodge` INTEGER NULL,
    `rune_adrenaline` INTEGER NULL,
    `rune_numb` INTEGER NULL,
    `rune_cleanse` INTEGER NULL,
    `rune_bless` INTEGER NULL,
    `rune_scavenge` INTEGER NULL,
    `rune_gut` INTEGER NULL,
    `rune_low_blow` INTEGER NULL,
    `rune_divine` INTEGER NULL,
    `rune_vamp` INTEGER NULL,
    `rune_void` INTEGER NULL,
    `UsedRunesBit` VARCHAR(250) NULL,
    `UnlockedRunesBit` VARCHAR(250) NULL,
    `tracker list` BLOB NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_deaths` (
    `player_id` INTEGER NOT NULL,
    `time` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `killed_by` VARCHAR(255) NOT NULL,
    `is_player` BOOLEAN NOT NULL DEFAULT true,
    `mostdamage_by` VARCHAR(100) NOT NULL,
    `mostdamage_is_player` BOOLEAN NOT NULL DEFAULT false,
    `unjustified` BOOLEAN NOT NULL DEFAULT false,
    `mostdamage_unjustified` BOOLEAN NOT NULL DEFAULT false,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `killed_by`(`killed_by`),
    INDEX `mostdamage_by`(`mostdamage_by`),
    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_depotitems` (
    `player_id` INTEGER NOT NULL,
    `sid` INTEGER NOT NULL,
    `pid` INTEGER NOT NULL DEFAULT 0,
    `itemtype` INTEGER NOT NULL DEFAULT 0,
    `count` INTEGER NOT NULL DEFAULT 0,
    `attributes` BLOB NOT NULL,

    UNIQUE INDEX `player_depotitems_unique`(`player_id`, `sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_hirelings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `active` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `sex` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `posx` INTEGER NOT NULL DEFAULT 0,
    `posy` INTEGER NOT NULL DEFAULT 0,
    `posz` INTEGER NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `looktype` INTEGER NOT NULL DEFAULT 136,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_inboxitems` (
    `player_id` INTEGER NOT NULL,
    `sid` INTEGER NOT NULL,
    `pid` INTEGER NOT NULL DEFAULT 0,
    `itemtype` INTEGER NOT NULL DEFAULT 0,
    `count` INTEGER NOT NULL DEFAULT 0,
    `attributes` BLOB NOT NULL,

    UNIQUE INDEX `player_inboxitems_unique`(`player_id`, `sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_items` (
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `pid` INTEGER NOT NULL DEFAULT 0,
    `sid` INTEGER NOT NULL DEFAULT 0,
    `itemtype` INTEGER NOT NULL DEFAULT 0,
    `count` INTEGER NOT NULL DEFAULT 0,
    `attributes` BLOB NOT NULL,

    INDEX `player_id`(`player_id`),
    INDEX `sid`(`sid`),
    PRIMARY KEY (`player_id`, `pid`, `sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_kills` (
    `player_id` INTEGER NOT NULL,
    `time` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `target` INTEGER NOT NULL,
    `unavenged` BOOLEAN NOT NULL DEFAULT false,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_namelocks` (
    `player_id` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `namelocked_at` BIGINT NOT NULL,
    `namelocked_by` INTEGER NOT NULL,

    UNIQUE INDEX `player_namelocks_unique`(`player_id`),
    INDEX `namelocked_by`(`namelocked_by`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_prey` (
    `player_id` INTEGER NOT NULL,
    `slot` BOOLEAN NOT NULL,
    `state` BOOLEAN NOT NULL,
    `raceid` VARCHAR(250) NOT NULL,
    `option` BOOLEAN NOT NULL,
    `bonus_type` BOOLEAN NOT NULL,
    `bonus_rarity` BOOLEAN NOT NULL,
    `bonus_percentage` VARCHAR(250) NOT NULL,
    `bonus_time` VARCHAR(250) NOT NULL,
    `free_reroll` BIGINT NOT NULL,
    `monster_list` BLOB NULL,

    PRIMARY KEY (`player_id`, `slot`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_rewards` (
    `player_id` INTEGER NOT NULL,
    `sid` INTEGER NOT NULL,
    `pid` INTEGER NOT NULL DEFAULT 0,
    `itemtype` INTEGER NOT NULL DEFAULT 0,
    `count` INTEGER NOT NULL DEFAULT 0,
    `attributes` BLOB NOT NULL,

    UNIQUE INDEX `player_rewards_unique`(`player_id`, `sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_spells` (
    `player_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`player_id`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_stash` (
    `player_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `item_count` INTEGER NOT NULL,

    PRIMARY KEY (`player_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_storage` (
    `player_id` INTEGER NOT NULL DEFAULT 0,
    `key` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `value` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`player_id`, `key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_taskhunt` (
    `player_id` INTEGER NOT NULL,
    `slot` BOOLEAN NOT NULL,
    `state` BOOLEAN NOT NULL,
    `raceid` VARCHAR(250) NOT NULL,
    `upgrade` BOOLEAN NOT NULL,
    `rarity` BOOLEAN NOT NULL,
    `kills` VARCHAR(250) NOT NULL,
    `disabled_time` BIGINT NOT NULL,
    `free_reroll` BIGINT NOT NULL,
    `monster_list` BLOB NULL,

    PRIMARY KEY (`player_id`, `slot`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_wheeldata` (
    `player_id` INTEGER NOT NULL,
    `slot` BLOB NOT NULL,

    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `group_id` INTEGER NOT NULL DEFAULT 1,
    `account_id` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `vocation` INTEGER NOT NULL DEFAULT 0,
    `health` INTEGER NOT NULL DEFAULT 150,
    `healthmax` INTEGER NOT NULL DEFAULT 150,
    `experience` BIGINT NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `looktype` INTEGER NOT NULL DEFAULT 136,
    `lookaddons` INTEGER NOT NULL DEFAULT 0,
    `maglevel` INTEGER NOT NULL DEFAULT 0,
    `mana` INTEGER NOT NULL DEFAULT 0,
    `manamax` INTEGER NOT NULL DEFAULT 0,
    `manaspent` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `soul` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `town_id` INTEGER NOT NULL DEFAULT 1,
    `posx` INTEGER NOT NULL DEFAULT 0,
    `posy` INTEGER NOT NULL DEFAULT 0,
    `posz` INTEGER NOT NULL DEFAULT 0,
    `conditions` MEDIUMBLOB NOT NULL,
    `cap` INTEGER NOT NULL DEFAULT 0,
    `sex` INTEGER NOT NULL DEFAULT 0,
    `pronoun` INTEGER NOT NULL DEFAULT 0,
    `lastlogin` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `lastip` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `save` BOOLEAN NOT NULL DEFAULT true,
    `skull` TINYINT NOT NULL DEFAULT 0,
    `skulltime` BIGINT NOT NULL DEFAULT 0,
    `lastlogout` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `blessings` TINYINT NOT NULL DEFAULT 0,
    `blessings1` TINYINT NOT NULL DEFAULT 0,
    `blessings2` TINYINT NOT NULL DEFAULT 0,
    `blessings3` TINYINT NOT NULL DEFAULT 0,
    `blessings4` TINYINT NOT NULL DEFAULT 0,
    `blessings5` TINYINT NOT NULL DEFAULT 0,
    `blessings6` TINYINT NOT NULL DEFAULT 0,
    `blessings7` TINYINT NOT NULL DEFAULT 0,
    `blessings8` TINYINT NOT NULL DEFAULT 0,
    `onlinetime` INTEGER NOT NULL DEFAULT 0,
    `deletion` BIGINT NOT NULL DEFAULT 0,
    `balance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `offlinetraining_time` SMALLINT UNSIGNED NOT NULL DEFAULT 43200,
    `offlinetraining_skill` TINYINT NOT NULL DEFAULT -1,
    `stamina` SMALLINT UNSIGNED NOT NULL DEFAULT 2520,
    `skill_fist` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_fist_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_club` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_club_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_sword` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_sword_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_axe` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_axe_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_dist` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_dist_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_shielding` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_shielding_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_fishing` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_fishing_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_critical_hit_chance` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_critical_hit_chance_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_critical_hit_damage` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_critical_hit_damage_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_life_leech_chance` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_life_leech_chance_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_life_leech_amount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_life_leech_amount_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_mana_leech_chance` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_mana_leech_chance_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_mana_leech_amount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `skill_mana_leech_amount_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_criticalhit_chance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_criticalhit_damage` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_lifeleech_chance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_lifeleech_amount` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_manaleech_chance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_manaleech_amount` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `manashield` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `max_manashield` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `xpboost_stamina` SMALLINT UNSIGNED NULL,
    `xpboost_value` TINYINT UNSIGNED NULL,
    `marriage_status` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `marriage_spouse` INTEGER NOT NULL DEFAULT -1,
    `bonus_rerolls` BIGINT NOT NULL DEFAULT 0,
    `prey_wildcard` BIGINT NOT NULL DEFAULT 0,
    `task_points` BIGINT NOT NULL DEFAULT 0,
    `quickloot_fallback` BOOLEAN NULL DEFAULT false,
    `lookmountbody` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lookmountfeet` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lookmounthead` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lookmountlegs` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lookfamiliarstype` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `isreward` BOOLEAN NOT NULL DEFAULT true,
    `istutorial` BOOLEAN NOT NULL DEFAULT false,
    `ismain` BOOLEAN NOT NULL DEFAULT false,
    `forge_dusts` BIGINT NOT NULL DEFAULT 0,
    `forge_dust_level` BIGINT NOT NULL DEFAULT 100,
    `randomize_mount` BOOLEAN NOT NULL DEFAULT false,
    `boss_points` INTEGER NOT NULL DEFAULT 0,
    `created` INTEGER NOT NULL DEFAULT 0,
    `hidden` BOOLEAN NOT NULL DEFAULT false,
    `comment` TEXT NOT NULL,
    `cast_on` TINYINT NOT NULL DEFAULT 0,
    `battlepass_rank` ENUM('FREE', 'VIP_SILVER', 'VIP_GOLD', 'DIAMOND') NOT NULL DEFAULT 'FREE',

    UNIQUE INDEX `players_unique`(`name`),
    INDEX `account_id`(`account_id`),
    INDEX `vocation`(`vocation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players_online` (
    `player_id` INTEGER NOT NULL,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `roulette_plays` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `uuid` VARCHAR(255) NOT NULL,
    `reward_id` INTEGER NOT NULL,
    `reward_count` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` BIGINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `uuid`(`uuid`),
    INDEX `player_id`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `server_config` (
    `config` VARCHAR(50) NOT NULL,
    `value` VARCHAR(256) NOT NULL DEFAULT '',
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`config`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` SMALLINT NOT NULL AUTO_INCREMENT,
    `status` TEXT NOT NULL,
    `account` TEXT NOT NULL,
    `points` TEXT NOT NULL,
    `codigo` TEXT NOT NULL,
    `chave` TEXT NOT NULL,
    `processed` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `mode` SMALLINT NOT NULL DEFAULT 0,
    `description` VARCHAR(3500) NOT NULL,
    `coin_type` BOOLEAN NOT NULL DEFAULT false,
    `coin_amount` INTEGER NOT NULL,
    `time` BIGINT UNSIGNED NOT NULL,
    `timestamp` INTEGER NOT NULL DEFAULT 0,
    `coins` INTEGER NOT NULL DEFAULT 0,

    INDEX `account_id`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tile_store` (
    `house_id` INTEGER NOT NULL,
    `data` LONGBLOB NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `house_id`(`house_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `towns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `posx` INTEGER NOT NULL DEFAULT 0,
    `posy` INTEGER NOT NULL DEFAULT 0,
    `posz` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z_ots_comunication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `type` VARCHAR(255) NOT NULL DEFAULT '',
    `action` VARCHAR(255) NOT NULL DEFAULT '',
    `param1` VARCHAR(255) NOT NULL DEFAULT '',
    `param2` VARCHAR(255) NOT NULL DEFAULT '',
    `param3` VARCHAR(255) NOT NULL DEFAULT '',
    `param4` VARCHAR(255) NOT NULL DEFAULT '',
    `param5` VARCHAR(255) NOT NULL DEFAULT '',
    `param6` VARCHAR(255) NOT NULL DEFAULT '',
    `param7` VARCHAR(255) NOT NULL DEFAULT '',
    `delete_it` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z_polls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `end` INTEGER NOT NULL DEFAULT 0,
    `start` INTEGER NOT NULL DEFAULT 0,
    `answers` INTEGER NOT NULL DEFAULT 0,
    `votes_all` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `z_polls_answers` (
    `poll_id` INTEGER NOT NULL,
    `answer_id` INTEGER NOT NULL,
    `answer` VARCHAR(255) NOT NULL,
    `votes` INTEGER NOT NULL DEFAULT 0,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

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

-- AddForeignKey
ALTER TABLE `wp_posts` ADD CONSTRAINT `wp_posts_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_social_medias` ADD CONSTRAINT `wp_social_medias_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_products` ADD CONSTRAINT `wp_products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `wp_products_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_ban_history` ADD CONSTRAINT `account_bans_history_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_ban_history` ADD CONSTRAINT `account_bans_history_player_fk` FOREIGN KEY (`banned_by`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_bans` ADD CONSTRAINT `account_bans_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_bans` ADD CONSTRAINT `account_bans_player_fk` FOREIGN KEY (`banned_by`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_vipgrouplist` ADD CONSTRAINT `account_vipgrouplist_player_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_vipgrouplist` ADD CONSTRAINT `account_vipgrouplist_vipgroup_fk` FOREIGN KEY (`vipgroup_id`, `account_id`) REFERENCES `account_vipgroups`(`id`, `account_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_viplist` ADD CONSTRAINT `account_viplist_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account_viplist` ADD CONSTRAINT `account_viplist_player_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wp_tokens` ADD CONSTRAINT `wp_tokens_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coins_transactions` ADD CONSTRAINT `coins_transactions_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `daily_reward_history` ADD CONSTRAINT `daily_reward_history_player_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `forge_history` ADD CONSTRAINT `forge_history_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_invites` ADD CONSTRAINT `guild_invites_guild_fk` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_invites` ADD CONSTRAINT `guild_invites_player_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_guild_fk` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_player_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_rank_fk` FOREIGN KEY (`rank_id`) REFERENCES `guild_ranks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_ranks` ADD CONSTRAINT `guild_ranks_fk` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guilds` ADD CONSTRAINT `guilds_ownerid_fk` FOREIGN KEY (`ownerid`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `guildwar_kills` ADD CONSTRAINT `guildwar_kills_warid_fk` FOREIGN KEY (`warid`) REFERENCES `guild_wars`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `house_lists` ADD CONSTRAINT `houses_list_house_fk` FOREIGN KEY (`house_id`) REFERENCES `houses`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ip_bans` ADD CONSTRAINT `ip_bans_players_fk` FOREIGN KEY (`banned_by`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `market_history` ADD CONSTRAINT `market_history_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `market_offers` ADD CONSTRAINT `market_offers_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `myaac_send_items` ADD CONSTRAINT `myaac_send_items_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pagseguro_transactions` ADD CONSTRAINT `pagseguro_transactions_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_deaths` ADD CONSTRAINT `player_deaths_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_depotitems` ADD CONSTRAINT `player_depotitems_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_hirelings` ADD CONSTRAINT `player_hirelings_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_inboxitems` ADD CONSTRAINT `player_inboxitems_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_items` ADD CONSTRAINT `player_items_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_namelocks` ADD CONSTRAINT `player_namelocks_players2_fk` FOREIGN KEY (`namelocked_by`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_namelocks` ADD CONSTRAINT `player_namelocks_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_rewards` ADD CONSTRAINT `player_rewards_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_spells` ADD CONSTRAINT `player_spells_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_storage` ADD CONSTRAINT `player_storage_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `player_wheeldata` ADD CONSTRAINT `player_wheeldata_players_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roulette_plays` ADD CONSTRAINT `roulette_plays_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `store_history` ADD CONSTRAINT `store_history_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tile_store` ADD CONSTRAINT `tile_store_account_fk` FOREIGN KEY (`house_id`) REFERENCES `houses`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
