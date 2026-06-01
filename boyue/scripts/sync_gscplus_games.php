<?php
/**
 * GSC+ Game List Sync Script
 *
 * This script syncs game list from GSC+ API to local database.
 * It should be run periodically (daily/weekly) via cron job.
 *
 * Usage:
 *   php scripts/sync_gscplus_games.php
 *
 * Cron example (daily at 3 AM):
 *   0 3 * * * cd /home/caipiao/boyue && php scripts/sync_gscplus_games.php >> /var/log/gscplus_sync.log 2>&1
 */

// Standalone script - load only what we need
require_once __DIR__ . '/../vendor/autoload.php';

// Load database config
$config = require __DIR__ . '/../config/database.php';
$dbConfig = $config['connections'][$config['default']];

// Create PDO connection
$dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['database']};charset={$dbConfig['charset']}";
$pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
]);

class GscPlusGameSync
{
    private $pdo;
    private $operatorUrl;
    private $operatorCode;
    private $secretKey;
    
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        
        // Load GSC+ config
        $stmt = $this->pdo->prepare("SELECT * FROM caipiao_gscplus_config WHERE status = 'active' LIMIT 1");
        $stmt->execute();
        $config = $stmt->fetch();
            
        if (!$config) {
            throw new Exception('GSC+ configuration not found. Please configure GSC+ first.');
        }
        
        $this->operatorUrl = rtrim($config->operator_url, '/');
        $this->operatorCode = $config->operator_code;
        $this->secretKey = $config->secret_key;
        
        echo "=================================================\n";
        echo "GSC+ Game List Sync Script\n";
        echo "=================================================\n";
        echo "Operator URL: {$this->operatorUrl}\n";
        echo "Operator Code: {$this->operatorCode}\n";
        echo "Started at: " . date('Y-m-d H:i:s') . "\n";
        echo "=================================================\n\n";
    }
    
    /**
     * Sync all games from GSC+ API
     */
    public function syncAll()
    {
        $startTime = microtime(true);
        $totalGames = 0;
        $totalErrors = 0;
        
        // Get all active GSC+ platforms
        $stmt = $this->pdo->prepare("
            SELECT * FROM caipiao_game_platform
            WHERE api_provider = 'GSC'
            AND status = 'online'
            AND product_code IS NOT NULL
            ORDER BY type, sort
        ");
        $stmt->execute();
        $platforms = $stmt->fetchAll();
        
        if (empty($platforms)) {
            echo "⚠️  No active GSC+ platforms found.\n";
            echo "Please configure GSC+ platforms first.\n";
            return;
        }
        
        echo "Found " . count($platforms) . " active GSC+ platforms\n\n";
        
        foreach ($platforms as $platform) {
            try {
                $count = $this->syncPlatformGames($platform);
                $totalGames += $count;
            } catch (Exception $e) {
                $totalErrors++;
                echo "❌ Error syncing {$platform->name}: {$e->getMessage()}\n\n";
            }
        }
        
        $duration = round(microtime(true) - $startTime, 2);
        
        echo "=================================================\n";
        echo "Sync Summary\n";
        echo "=================================================\n";
        echo "Total platforms: " . count($platforms) . "\n";
        echo "Total games synced: {$totalGames}\n";
        echo "Total errors: {$totalErrors}\n";
        echo "Duration: {$duration} seconds\n";
        echo "Completed at: " . date('Y-m-d H:i:s') . "\n";
        echo "=================================================\n";
    }
    
    /**
     * Sync games for a specific platform
     */
    private function syncPlatformGames($platform)
    {
        echo "📦 Syncing: {$platform->name} (Product Code: {$platform->product_code}, Type: {$platform->type})\n";
        
        // Call GSC+ provider-games API
        $games = $this->fetchGamesFromAPI($platform->product_code);
        
        if (empty($games)) {
            echo "   ⚠️  No games found\n\n";
            return 0;
        }
        
        echo "   Found " . count($games) . " games from API\n";
        
        $inserted = 0;
        $updated = 0;
        $skipped = 0;
        
        foreach ($games as $game) {
            try {
                $result = $this->upsertGame($platform, $game);
                
                if ($result === 'inserted') {
                    $inserted++;
                } elseif ($result === 'updated') {
                    $updated++;
                } else {
                    $skipped++;
                }
            } catch (Exception $e) {
                $skipped++;
                echo "   ⚠️  Skipped game {$game['game_code']}: {$e->getMessage()}\n";
            }
        }
        
        echo "   ✅ Inserted: {$inserted}, Updated: {$updated}, Skipped: {$skipped}\n\n";
        
        return count($games);
    }
    
    /**
     * Fetch games from GSC+ API
     */
    private function fetchGamesFromAPI($productCode)
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', $this->operatorCode . $timestamp, $this->secretKey);
        
        $url = "{$this->operatorUrl}/api/operators/provider-games?product_code={$productCode}";
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => [
                'operator-code: ' . $this->operatorCode,
                'signature: ' . $signature,
                'timestamp: ' . $timestamp,
                'Content-Type: application/json'
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new Exception("cURL error: {$error}");
        }
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP error: {$httpCode}");
        }
        
        $data = json_decode($response, true);
        
        if (!isset($data['data']['games'])) {
            throw new Exception("Invalid API response format");
        }
        
        return $data['data']['games'];
    }
    
    /**
     * Insert or update game in database
     */
    private function upsertGame($platform, $game)
    {
        $currency = $game['support_currency'] ?? 'VND';
        
        // Check if game exists
        $stmt = $this->pdo->prepare("
            SELECT id FROM caipiao_game_list
            WHERE product_code = ? AND game_code = ? AND support_currency = ?
        ");
        $stmt->execute([$platform->product_code, $game['game_code'], $currency]);
        $existing = $stmt->fetch();
        
        $now = time();
        
        if ($existing) {
            // Update existing game
            $stmt = $this->pdo->prepare("
                UPDATE caipiao_game_list SET
                    platform_id = ?,
                    game_name = ?,
                    game_type = ?,
                    type = ?,
                    image_url = ?,
                    status = ?,
                    allow_free_round = ?,
                    lang_name = ?,
                    lang_icon = ?,
                    gsc_created_at = ?,
                    updated_at = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $platform->id,
                $game['game_name'],
                $game['game_type'],
                $platform->type,
                $game['image_url'] ?? null,
                $game['status'] ?? 'active',
                $game['allow_free_round'] ?? 0,
                json_encode($game['lang_name'] ?? []),
                json_encode($game['lang_icon'] ?? []),
                $game['created_at'] ?? null,
                $now,
                $existing->id
            ]);
            return 'updated';
        } else {
            // Insert new game
            $stmt = $this->pdo->prepare("
                INSERT INTO caipiao_game_list
                (platform_id, product_code, game_code, game_name, game_type, type,
                 image_url, support_currency, status, allow_free_round, lang_name,
                 lang_icon, gsc_created_at, hot, recommend, sort, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)
            ");
            $stmt->execute([
                $platform->id,
                $platform->product_code,
                $game['game_code'],
                $game['game_name'],
                $game['game_type'],
                $platform->type,
                $game['image_url'] ?? null,
                $currency,
                $game['status'] ?? 'active',
                $game['allow_free_round'] ?? 0,
                json_encode($game['lang_name'] ?? []),
                json_encode($game['lang_icon'] ?? []),
                $game['created_at'] ?? null,
                $now,
                $now
            ]);
            return 'inserted';
        }
    }
    
    /**
     * Clean up inactive games
     * Remove games that are no longer in API response
     */
    public function cleanupInactiveGames($daysOld = 30)
    {
        echo "\n🧹 Cleaning up inactive games (older than {$daysOld} days)...\n";
        
        $cutoffTime = time() - ($daysOld * 86400);
        
        $deleted = Db::table('caipiao_game_list')
            ->where('updated_at', '<', $cutoffTime)
            ->where('status', '!=', 'active')
            ->delete();
        
        echo "   Deleted {$deleted} inactive games\n";
    }
}

// Run the sync
try {
    $sync = new GscPlusGameSync();
    $sync->syncAll();
    
    // Optional: Clean up old inactive games
    // $sync->cleanupInactiveGames(30);
    
    exit(0);
} catch (Exception $e) {
    echo "\n❌ Fatal Error: {$e->getMessage()}\n";
    echo "Stack trace:\n{$e->getTraceAsString()}\n";
    exit(1);
}

// Made with Bob
