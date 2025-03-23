CREATE TABLE IF NOT EXISTS `roulette_plays` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `uuid` VARCHAR(255) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `reward_count` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = rolling | 1 = pending | 2 = delivered',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY (`uuid`),
  FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE 
);
