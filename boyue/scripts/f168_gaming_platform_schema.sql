-- ============================================
-- F168 Gaming Platform Database Schema
-- Optimized for Vue.js Frontend + PHP Backend
-- ============================================

-- 1. Users Table - Store user information
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `balance` DECIMAL(15, 2) DEFAULT 0.00,
    `vip_level` TINYINT UNSIGNED DEFAULT 0,
    `phone` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(100) DEFAULT NULL,
    `avatar_url` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('active', 'suspended', 'banned') DEFAULT 'active',
    `last_login_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_status` (`status`),
    INDEX `idx_vip_level` (`vip_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts table';

-- 2. Game Categories Table - Store game categories (Casino, Slots, Blockchain, etc.)
CREATE TABLE IF NOT EXISTS `game_categories` (
    `category_id` VARCHAR(30) PRIMARY KEY,
    `category_name` VARCHAR(100) NOT NULL,
    `category_name_vi` VARCHAR(100) DEFAULT NULL COMMENT 'Vietnamese name',
    `icon_url` VARCHAR(255) DEFAULT NULL,
    `sort_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_sort_order` (`sort_order`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Game categories';

-- 3. Games Table - Store all available games
CREATE TABLE IF NOT EXISTS `games` (
    `game_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` VARCHAR(30) NOT NULL,
    `game_code` VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique game identifier',
    `game_name` VARCHAR(150) NOT NULL,
    `game_name_vi` VARCHAR(150) DEFAULT NULL COMMENT 'Vietnamese name',
    `provider` VARCHAR(50) NOT NULL COMMENT 'Game provider (SEXY, DG, PG, etc.)',
    `image_url` VARCHAR(255) NOT NULL,
    `thumbnail_url` VARCHAR(255) DEFAULT NULL,
    `is_hot` BOOLEAN DEFAULT FALSE,
    `is_new` BOOLEAN DEFAULT FALSE,
    `is_favorite` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `sort_order` INT DEFAULT 0,
    `play_count` INT UNSIGNED DEFAULT 0 COMMENT 'Total play count',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `game_categories`(`category_id`) ON DELETE CASCADE,
    INDEX `idx_category` (`category_id`),
    INDEX `idx_provider` (`provider`),
    INDEX `idx_is_hot` (`is_hot`),
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Games list';

-- 4. User Favorites Table - Store user favorite games
CREATE TABLE IF NOT EXISTS `user_favorites` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `game_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_game` (`user_id`, `game_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User favorite games';

-- 5. Win Logs Table - Store big win records for live ticker
CREATE TABLE IF NOT EXISTS `win_logs` (
    `log_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `username_masked` VARCHAR(50) NOT NULL COMMENT 'Masked username like 1***38',
    `game_id` INT UNSIGNED DEFAULT NULL,
    `game_name` VARCHAR(150) DEFAULT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `bet_amount` DECIMAL(15, 2) DEFAULT NULL,
    `multiplier` DECIMAL(10, 2) DEFAULT NULL COMMENT 'Win multiplier',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE SET NULL,
    INDEX `idx_created_at` (`created_at` DESC),
    INDEX `idx_amount` (`amount` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Big win records for live feed';

-- 6. Bet History Table - Store all betting records
CREATE TABLE IF NOT EXISTS `bet_history` (
    `bet_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `game_id` INT UNSIGNED NOT NULL,
    `bet_amount` DECIMAL(15, 2) NOT NULL,
    `win_amount` DECIMAL(15, 2) DEFAULT 0.00,
    `profit` DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'win_amount - bet_amount',
    `status` ENUM('pending', 'win', 'lose', 'cancelled') DEFAULT 'pending',
    `bet_data` JSON DEFAULT NULL COMMENT 'Additional bet details',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `settled_at` TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`game_id`) REFERENCES `games`(`game_id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_game_id` (`game_id`),
    INDEX `idx_created_at` (`created_at` DESC),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Betting history';

-- 7. Transactions Table - Store deposit/withdrawal records
CREATE TABLE IF NOT EXISTS `transactions` (
    `transaction_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `type` ENUM('deposit', 'withdrawal', 'bonus', 'refund', 'commission') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `balance_before` DECIMAL(15, 2) NOT NULL,
    `balance_after` DECIMAL(15, 2) NOT NULL,
    `status` ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    `payment_method` VARCHAR(50) DEFAULT NULL,
    `reference_id` VARCHAR(100) DEFAULT NULL,
    `note` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Financial transactions';

-- 8. Announcements Table - Store marquee notices
CREATE TABLE IF NOT EXISTS `announcements` (
    `announcement_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('info', 'warning', 'promotion', 'maintenance') DEFAULT 'info',
    `is_active` BOOLEAN DEFAULT TRUE,
    `priority` INT DEFAULT 0 COMMENT 'Higher priority shows first',
    `start_at` TIMESTAMP NULL DEFAULT NULL,
    `end_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_priority` (`priority` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System announcements';

-- 9. User Sessions Table - Track active sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
    `session_id` VARCHAR(64) PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Active user sessions';

-- ============================================
-- Insert Sample Data
-- ============================================

-- Insert Game Categories
INSERT INTO `game_categories` (`category_id`, `category_name`, `category_name_vi`, `icon_url`, `sort_order`) VALUES
('HOT', 'Hot Games', 'Trò Chơi Hot', '/assets/icons/hot.png', 1),
('CASINO', 'Live Casino', 'Casino Trực Tuyến', '/assets/icons/casino.png', 2),
('SLOTS', 'Slot Games', 'Nổ Hũ', '/assets/icons/slots.png', 3),
('BLOCKCHAIN', 'Blockchain', 'Blockchain', '/assets/icons/blockchain.png', 4),
('SPORTS', 'Sports Betting', 'Thể Thao', '/assets/icons/sports.png', 5),
('LOTTERY', 'Lottery', 'Xổ Số', '/assets/icons/lottery.png', 6),
('FISHING', 'Fishing', 'Bắn Cá', '/assets/icons/fishing.png', 7),
('CHESS', 'Chess & Cards', 'Cờ Bài', '/assets/icons/chess.png', 8);

-- Insert Sample Games
INSERT INTO `games` (`category_id`, `game_code`, `game_name`, `game_name_vi`, `provider`, `image_url`, `is_hot`, `is_new`, `sort_order`) VALUES
-- Hot Games
('HOT', 'SEXY_BACCARAT', 'Sexy Baccarat', 'Baccarat Sexy', 'SEXY', '/assets/games/sexy-baccarat.jpg', TRUE, FALSE, 1),
('HOT', 'PG_FORTUNE_TIGER', 'Fortune Tiger', 'Hổ May Mắn', 'PG', '/assets/games/fortune-tiger.jpg', TRUE, TRUE, 2),
('HOT', 'DG_DRAGON_TIGER', 'Dragon Tiger', 'Rồng Hổ', 'DG', '/assets/games/dragon-tiger.jpg', TRUE, FALSE, 3),

-- Casino Games
('CASINO', 'SEXY_ROULETTE', 'Sexy Roulette', 'Roulette Sexy', 'SEXY', '/assets/games/sexy-roulette.jpg', FALSE, FALSE, 1),
('CASINO', 'DG_BACCARAT', 'DG Baccarat', 'Baccarat DG', 'DG', '/assets/games/dg-baccarat.jpg', TRUE, FALSE, 2),
('CASINO', 'AG_SICBO', 'AG Sic Bo', 'Xóc Đĩa AG', 'AG', '/assets/games/ag-sicbo.jpg', FALSE, FALSE, 3),

-- Slot Games
('SLOTS', 'PG_CANDY_BONANZA', 'Candy Bonanza', 'Kẹo Ngọt', 'PG', '/assets/games/candy-bonanza.jpg', TRUE, TRUE, 1),
('SLOTS', 'PG_WILD_BANDITO', 'Wild Bandito', 'Cao Bồi Hoang Dã', 'PG', '/assets/games/wild-bandito.jpg', FALSE, FALSE, 2),
('SLOTS', 'JDB_FORTUNE_GEMS', 'Fortune Gems', 'Đá Quý May Mắn', 'JDB', '/assets/games/fortune-gems.jpg', TRUE, FALSE, 3),

-- Blockchain Games
('BLOCKCHAIN', 'HASH_DICE', 'Hash Dice', 'Xúc Xắc Hash', 'BLOCKCHAIN', '/assets/games/hash-dice.jpg', FALSE, TRUE, 1),
('BLOCKCHAIN', 'CRASH_GAME', 'Crash Game', 'Trò Chơi Crash', 'BLOCKCHAIN', '/assets/games/crash.jpg', TRUE, FALSE, 2);

-- Insert Sample Win Logs (for live ticker)
INSERT INTO `win_logs` (`user_id`, `username_masked`, `game_name`, `amount`, `bet_amount`, `multiplier`) VALUES
(1, '1***38', 'Fortune Tiger', 15680.50, 100.00, 156.81),
(2, '5***6a', 'Sexy Baccarat', 8920.00, 500.00, 17.84),
(3, '9***2k', 'Dragon Tiger', 12450.75, 250.00, 49.80),
(4, '3***9x', 'Candy Bonanza', 25600.00, 50.00, 512.00),
(5, '7***4m', 'Hash Dice', 18900.25, 300.00, 63.00);

-- Insert Sample Announcements
INSERT INTO `announcements` (`title`, `content`, `type`, `priority`) VALUES
('Chào mừng đến F168!', 'Nền tảng game uy tín hàng đầu Việt Nam. Nạp đầu tặng 100%!', 'promotion', 10),
('Bảo trì hệ thống', 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 sáng ngày mai', 'maintenance', 5),
('Khuyến mãi tuần', 'Hoàn trả 0.8% mỗi ngày, không giới hạn!', 'promotion', 8);

-- ============================================
-- Create Indexes for Performance Optimization
-- ============================================

-- Optimize win_logs for real-time feed queries
ALTER TABLE `win_logs` ADD INDEX `idx_recent_wins` (`created_at` DESC, `amount` DESC);

-- Optimize games for category filtering
ALTER TABLE `games` ADD INDEX `idx_category_active` (`category_id`, `is_active`, `sort_order`);

-- Optimize bet_history for user queries
ALTER TABLE `bet_history` ADD INDEX `idx_user_recent` (`user_id`, `created_at` DESC);

-- ============================================
-- Create Views for Common Queries
-- ============================================

-- View: Recent Big Wins (for live ticker)
CREATE OR REPLACE VIEW `v_recent_big_wins` AS
SELECT 
    w.log_id,
    w.username_masked,
    w.game_name,
    w.amount,
    w.multiplier,
    w.created_at,
    g.image_url as game_image
FROM `win_logs` w
LEFT JOIN `games` g ON w.game_id = g.game_id
WHERE w.created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY w.created_at DESC
LIMIT 50;

-- View: Hot Games (most played in last 24h)
CREATE OR REPLACE VIEW `v_hot_games` AS
SELECT 
    g.*,
    COUNT(bh.bet_id) as play_count_24h,
    SUM(bh.bet_amount) as total_bet_24h
FROM `games` g
LEFT JOIN `bet_history` bh ON g.game_id = bh.game_id 
    AND bh.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
WHERE g.is_active = TRUE
GROUP BY g.game_id
ORDER BY play_count_24h DESC
LIMIT 20;

-- View: User Statistics
CREATE OR REPLACE VIEW `v_user_stats` AS
SELECT 
    u.user_id,
    u.username,
    u.balance,
    u.vip_level,
    COUNT(DISTINCT bh.bet_id) as total_bets,
    COALESCE(SUM(bh.bet_amount), 0) as total_wagered,
    COALESCE(SUM(bh.profit), 0) as total_profit,
    COUNT(DISTINCT uf.game_id) as favorite_games_count
FROM `users` u
LEFT JOIN `bet_history` bh ON u.user_id = bh.user_id
LEFT JOIN `user_favorites` uf ON u.user_id = uf.user_id
GROUP BY u.user_id;

-- ============================================
-- Stored Procedures
-- ============================================

-- Procedure: Add Win Log and Update Game Stats
DELIMITER $$
CREATE PROCEDURE `sp_add_win_log`(
    IN p_user_id INT,
    IN p_game_id INT,
    IN p_amount DECIMAL(15,2),
    IN p_bet_amount DECIMAL(15,2)
)
BEGIN
    DECLARE v_username VARCHAR(50);
    DECLARE v_game_name VARCHAR(150);
    DECLARE v_masked_username VARCHAR(50);
    DECLARE v_multiplier DECIMAL(10,2);
    
    -- Get user and game info
    SELECT username INTO v_username FROM users WHERE user_id = p_user_id;
    SELECT game_name INTO v_game_name FROM games WHERE game_id = p_game_id;
    
    -- Create masked username (e.g., 1***38)
    SET v_masked_username = CONCAT(
        LEFT(v_username, 1),
        '***',
        RIGHT(v_username, 2)
    );
    
    -- Calculate multiplier
    SET v_multiplier = p_amount / p_bet_amount;
    
    -- Insert win log
    INSERT INTO win_logs (user_id, username_masked, game_id, game_name, amount, bet_amount, multiplier)
    VALUES (p_user_id, v_masked_username, p_game_id, v_game_name, p_amount, p_bet_amount, v_multiplier);
    
    -- Update game play count
    UPDATE games SET play_count = play_count + 1 WHERE game_id = p_game_id;
END$$
DELIMITER ;

-- ============================================
-- Triggers
-- ============================================

-- Trigger: Update user balance after transaction
DELIMITER $$
CREATE TRIGGER `trg_update_balance_after_transaction`
AFTER INSERT ON `transactions`
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE users 
        SET balance = NEW.balance_after 
        WHERE user_id = NEW.user_id;
    END IF;
END$$
DELIMITER ;

-- ============================================
-- Performance Notes
-- ============================================
-- 1. All foreign keys have corresponding indexes
-- 2. Frequently queried columns (is_hot, is_active, category_id) are indexed
-- 3. Composite indexes for common query patterns
-- 4. Views created for complex queries to improve readability
-- 5. Use EXPLAIN to analyze query performance before deployment

-- Made with Bob
