-- TOP Game Provider Integration Schema
-- Database: by
-- Created: 2026-06-01
-- Purpose: Support seamless wallet integration with TOP Provider

-- ============================================
-- 1. Game Providers Table
-- ============================================
CREATE TABLE IF NOT EXISTS `game_providers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Provider name',
  `code` VARCHAR(20) UNIQUE NOT NULL COMMENT 'Provider code (e.g., TOP, PG, TCG)',
  `api_url` VARCHAR(255) NOT NULL COMMENT 'API endpoint URL',
  `api_key` VARCHAR(255) NOT NULL COMMENT 'Encrypted API Key',
  `api_secret` VARCHAR(255) NOT NULL COMMENT 'Encrypted API Secret',
  `operator_id` VARCHAR(100) NOT NULL COMMENT 'Operator/Agent ID',
  `currency` VARCHAR(10) DEFAULT 'VNDK' COMMENT 'Default currency',
  `language` VARCHAR(10) DEFAULT 'vi' COMMENT 'Default language',
  `callback_url` VARCHAR(255) NOT NULL COMMENT 'System callback URL',
  `webhook_secret` VARCHAR(255) DEFAULT NULL COMMENT 'Webhook signature secret',
  `status` TINYINT DEFAULT 0 COMMENT '0=inactive, 1=active',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  INDEX `idx_code` (`code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Game provider configurations';

-- ============================================
-- 2. Games Table (Extended for TOP Provider)
-- ============================================
CREATE TABLE IF NOT EXISTS `games` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `provider_id` INT NOT NULL COMMENT 'FK to game_providers',
  `game_code` VARCHAR(50) NOT NULL COMMENT 'Game code from provider',
  `game_name` VARCHAR(200) NOT NULL COMMENT 'Game display name',
  `game_name_vi` VARCHAR(200) DEFAULT NULL COMMENT 'Vietnamese name',
  `game_type` VARCHAR(20) NOT NULL COMMENT 'Game type: slot, live, sports, etc.',
  `category_id` VARCHAR(20) DEFAULT NULL COMMENT 'Category identifier',
  `thumbnail` VARCHAR(255) DEFAULT NULL COMMENT 'Game thumbnail URL',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT 'Game image URL',
  `rtp` DECIMAL(5,2) DEFAULT NULL COMMENT 'Return to player %',
  `volatility` VARCHAR(20) DEFAULT NULL COMMENT 'Volatility: low, medium, high',
  `max_win` INT DEFAULT NULL COMMENT 'Maximum win multiplier',
  `is_active` TINYINT DEFAULT 1 COMMENT '0=inactive, 1=active',
  `is_hot` TINYINT DEFAULT 0 COMMENT 'Hot game flag',
  `is_new` TINYINT DEFAULT 0 COMMENT 'New game flag',
  `play_count` INT DEFAULT 0 COMMENT 'Total play count',
  `sort_order` INT DEFAULT 0 COMMENT 'Display sort order',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  UNIQUE KEY `uk_provider_game` (`provider_id`, `game_code`),
  INDEX `idx_provider` (`provider_id`),
  INDEX `idx_type` (`game_type`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_status` (`is_active`),
  INDEX `idx_hot` (`is_hot`),
  INDEX `idx_new` (`is_new`),
  FOREIGN KEY (`provider_id`) REFERENCES `game_providers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Games catalog';

-- ============================================
-- 3. Game Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS `game_sessions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK to users',
  `game_id` INT NOT NULL COMMENT 'FK to games',
  `provider_id` INT NOT NULL COMMENT 'FK to game_providers',
  `session_id` VARCHAR(100) NOT NULL COMMENT 'Session ID from provider',
  `game_url` TEXT NOT NULL COMMENT 'Game launch URL',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT 'active, completed, expired',
  `created_at` DATETIME NOT NULL,
  `expired_at` DATETIME DEFAULT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_session` (`session_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Game session tracking';

-- ============================================
-- 4. Game Transactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS `game_transactions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK to users',
  `game_id` INT NOT NULL COMMENT 'FK to games',
  `provider_id` INT NOT NULL COMMENT 'FK to game_providers',
  `game_round_id` VARCHAR(100) NOT NULL COMMENT 'Round ID from provider',
  `transaction_type` VARCHAR(20) NOT NULL COMMENT 'bet, win, refund',
  `amount` DECIMAL(15,2) NOT NULL COMMENT 'Transaction amount',
  `balance_before` DECIMAL(15,2) NOT NULL COMMENT 'Balance before transaction',
  `balance_after` DECIMAL(15,2) NOT NULL COMMENT 'Balance after transaction',
  `status` VARCHAR(20) DEFAULT 'completed' COMMENT 'pending, completed, failed',
  `provider_txn_id` VARCHAR(100) DEFAULT NULL COMMENT 'Provider transaction ID',
  `created_at` DATETIME NOT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_game` (`game_id`),
  INDEX `idx_round` (`game_round_id`),
  INDEX `idx_provider_txn` (`provider_txn_id`),
  INDEX `idx_type` (`transaction_type`),
  INDEX `idx_created` (`created_at`),
  UNIQUE KEY `uk_provider_txn` (`provider_id`, `provider_txn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Game transaction logs';

-- ============================================
-- 5. Game Rounds Table
-- ============================================
CREATE TABLE IF NOT EXISTS `game_rounds` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK to users',
  `game_id` INT NOT NULL COMMENT 'FK to games',
  `provider_id` INT NOT NULL COMMENT 'FK to game_providers',
  `round_id` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Round ID from provider',
  `bet_amount` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Total bet amount',
  `win_amount` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Total win amount',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT 'active, settled, cancelled',
  `started_at` DATETIME NOT NULL,
  `settled_at` DATETIME DEFAULT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_round` (`round_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_started` (`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Game round tracking';

-- ============================================
-- 6. Insert TOP Provider Configuration
-- ============================================
INSERT INTO `game_providers` (
  `name`, `code`, `api_url`, `api_key`, `api_secret`, 
  `operator_id`, `currency`, `language`, `callback_url`, 
  `status`, `created_at`, `updated_at`
) VALUES (
  'Top Game Provider', 
  'TOP', 
  'https://dcyqv8f2id.com/api/v2', 
  'PLACEHOLDER_API_KEY_FROM_PROFILE', 
  'PLACEHOLDER_SECRET', 
  'dj-stg-vndk3', 
  'VNDK', 
  'vi', 
  'https://boyue.okwink6.com/api/games/callback', 
  0, 
  NOW(), 
  NOW()
) ON DUPLICATE KEY UPDATE
  `api_url` = VALUES(`api_url`),
  `operator_id` = VALUES(`operator_id`),
  `callback_url` = VALUES(`callback_url`),
  `updated_at` = NOW();

-- ============================================
-- 7. Create indexes for performance
-- ============================================
ALTER TABLE `game_transactions` 
  ADD INDEX `idx_user_created` (`user_id`, `created_at`),
  ADD INDEX `idx_game_created` (`game_id`, `created_at`);

ALTER TABLE `game_rounds` 
  ADD INDEX `idx_user_started` (`user_id`, `started_at`),
  ADD INDEX `idx_game_started` (`game_id`, `started_at`);

-- ============================================
-- 8. Add game_id column to existing tables if needed
-- ============================================
-- Check if game_id exists in games table, if not using old schema
ALTER TABLE `games` 
  ADD COLUMN IF NOT EXISTS `game_id` INT UNIQUE AFTER `id`,
  ADD INDEX IF NOT EXISTS `idx_game_id` (`game_id`);

-- Update game_id to match id if null
UPDATE `games` SET `game_id` = `id` WHERE `game_id` IS NULL;

-- Made with Bob
