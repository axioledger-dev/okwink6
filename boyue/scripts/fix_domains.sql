-- ============================================
-- Fix Domains Script
-- Date: 2026-05-22
-- Purpose: Replace old dead domains with local paths
-- Old domains: https://web.hwyla8.net, https://www.hwdl5.com
-- New path: /public
-- ============================================

-- Set database
USE `by-vi`;

-- ============================================
-- STEP 1: BACKUP BEFORE CHANGES
-- ============================================

-- Create backup table with timestamp
DROP TABLE IF EXISTS backup_before_domain_fix_20260522;

CREATE TABLE backup_before_domain_fix_20260522 AS
SELECT 
    'caipiao_game' as table_name, 
    id, 
    icon as field1, 
    logo as field2,
    NULL as field3
FROM caipiao_game
WHERE icon LIKE '%hwyla8%' OR icon LIKE '%hwdl5%' 
   OR logo LIKE '%hwyla8%' OR logo LIKE '%hwdl5%'

UNION ALL

SELECT 
    'caipiao_banner' as table_name,
    id,
    image as field1,
    NULL as field2,
    NULL as field3
FROM caipiao_banner
WHERE image LIKE '%hwyla8%' OR image LIKE '%hwdl5%'

UNION ALL

SELECT 
    'caipiao_config' as table_name,
    id,
    `key` as field1,
    value as field2,
    NULL as field3
FROM caipiao_config
WHERE value LIKE '%hwyla8%' OR value LIKE '%hwdl5%'

UNION ALL

SELECT 
    'gscplus_games' as table_name,
    id,
    icon_url as field1,
    banner_url as field2,
    NULL as field3
FROM gscplus_games
WHERE icon_url LIKE '%hwyla8%' OR icon_url LIKE '%hwdl5%'
   OR banner_url LIKE '%hwyla8%' OR banner_url LIKE '%hwdl5%';

SELECT '✓ Backup created successfully' as status;
SELECT COUNT(*) as backed_up_records FROM backup_before_domain_fix_20260522;

-- ============================================
-- STEP 2: FIND ALL AFFECTED RECORDS
-- ============================================

SELECT '=== AFFECTED RECORDS BEFORE FIX ===' as info;

SELECT 'caipiao_game' as table_name, COUNT(*) as count 
FROM caipiao_game 
WHERE icon LIKE '%hwyla8%' OR icon LIKE '%hwdl5%' 
   OR logo LIKE '%hwyla8%' OR logo LIKE '%hwdl5%'

UNION ALL

SELECT 'caipiao_banner', COUNT(*) 
FROM caipiao_banner 
WHERE image LIKE '%hwyla8%' OR image LIKE '%hwdl5%'

UNION ALL

SELECT 'caipiao_config', COUNT(*) 
FROM caipiao_config 
WHERE value LIKE '%hwyla8%' OR value LIKE '%hwdl5%'

UNION ALL

SELECT 'gscplus_games', COUNT(*) 
FROM gscplus_games 
WHERE icon_url LIKE '%hwyla8%' OR icon_url LIKE '%hwdl5%'
   OR banner_url LIKE '%hwyla8%' OR banner_url LIKE '%hwdl5%';

-- ============================================
-- STEP 3: REPLACE DOMAINS
-- ============================================

-- Fix caipiao_game table
UPDATE caipiao_game 
SET 
    icon = REPLACE(REPLACE(icon, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public'),
    logo = REPLACE(REPLACE(logo, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public')
WHERE icon LIKE '%hwyla8%' OR icon LIKE '%hwdl5%' 
   OR logo LIKE '%hwyla8%' OR logo LIKE '%hwdl5%';

SELECT '✓ Fixed caipiao_game table' as status;

-- Fix caipiao_banner table
UPDATE caipiao_banner 
SET image = REPLACE(REPLACE(image, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public')
WHERE image LIKE '%hwyla8%' OR image LIKE '%hwdl5%';

SELECT '✓ Fixed caipiao_banner table' as status;

-- Fix caipiao_config table
UPDATE caipiao_config 
SET value = REPLACE(REPLACE(value, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public')
WHERE value LIKE '%hwyla8%' OR value LIKE '%hwdl5%';

SELECT '✓ Fixed caipiao_config table' as status;

-- Fix gscplus_games table
UPDATE gscplus_games 
SET 
    icon_url = REPLACE(REPLACE(icon_url, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public'),
    banner_url = REPLACE(REPLACE(banner_url, 'https://web.hwyla8.net', '/public'), 'https://www.hwdl5.com', '/public')
WHERE icon_url LIKE '%hwyla8%' OR icon_url LIKE '%hwdl5%'
   OR banner_url LIKE '%hwyla8%' OR banner_url LIKE '%hwdl5%';

SELECT '✓ Fixed gscplus_games table' as status;

-- ============================================
-- STEP 4: VERIFY CHANGES
-- ============================================

SELECT '=== VERIFICATION: REMAINING OLD DOMAINS ===' as info;

SELECT 'caipiao_game' as table_name, COUNT(*) as remaining_old_domains
FROM caipiao_game 
WHERE icon LIKE '%hwyla8%' OR icon LIKE '%hwdl5%' 
   OR logo LIKE '%hwyla8%' OR logo LIKE '%hwdl5%'

UNION ALL

SELECT 'caipiao_banner', COUNT(*) 
FROM caipiao_banner 
WHERE image LIKE '%hwyla8%' OR image LIKE '%hwdl5%'

UNION ALL

SELECT 'caipiao_config', COUNT(*) 
FROM caipiao_config 
WHERE value LIKE '%hwyla8%' OR value LIKE '%hwdl5%'

UNION ALL

SELECT 'gscplus_games', COUNT(*) 
FROM gscplus_games 
WHERE icon_url LIKE '%hwyla8%' OR icon_url LIKE '%hwdl5%'
   OR banner_url LIKE '%hwyla8%' OR banner_url LIKE '%hwdl5%';

-- ============================================
-- STEP 5: SHOW SAMPLE FIXED RECORDS
-- ============================================

SELECT '=== SAMPLE FIXED RECORDS ===' as info;

SELECT 'caipiao_game' as table_name, id, name, icon, logo 
FROM caipiao_game 
WHERE icon LIKE '/public%' OR logo LIKE '/public%'
LIMIT 5;

SELECT 'caipiao_banner' as table_name, id, title, image 
FROM caipiao_banner 
WHERE image LIKE '/public%'
LIMIT 5;

SELECT 'gscplus_games' as table_name, id, game_name, icon_url, banner_url 
FROM gscplus_games 
WHERE icon_url LIKE '/public%' OR banner_url LIKE '/public%'
LIMIT 5;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

SELECT '✓✓✓ DOMAIN FIX COMPLETED SUCCESSFULLY ✓✓✓' as status;
SELECT 'Backup table: backup_before_domain_fix_20260522' as info;
SELECT 'To rollback, restore from backup table' as note;

-- Made with Bob
