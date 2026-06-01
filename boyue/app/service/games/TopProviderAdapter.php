<?php

namespace app\service\games;

use support\Log;
use support\Redis;
use support\Db;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

/**
 * TOP Game Provider Adapter
 * Handles API communication with TOP Provider for seamless wallet integration
 */
class TopProviderAdapter
{
    private string $apiUrl;
    private string $apiKey;
    private string $apiSecret;
    private string $operatorId;
    private string $currency;
    private string $language;
    private string $callbackUrl;
    private Client $httpClient;
    private int $providerId;

    public function __construct()
    {
        $this->apiUrl = getenv('TOP_PROVIDER_API_URL') ?: 'https://dcyqv8f2id.com/api/v2';
        $this->apiKey = getenv('TOP_PROVIDER_API_KEY') ?: '';
        $this->apiSecret = getenv('TOP_PROVIDER_API_SECRET') ?: '';
        $this->operatorId = getenv('TOP_PROVIDER_OPERATOR_ID') ?: 'dj-stg-vndk3';
        $this->currency = getenv('TOP_PROVIDER_CURRENCY') ?: 'VNDK';
        $this->language = getenv('TOP_PROVIDER_LANGUAGE') ?: 'vi';
        $this->callbackUrl = getenv('TOP_PROVIDER_CALLBACK_URL') ?: 'https://boyue.okwink6.com/api/games/callback';

        $this->httpClient = new Client([
            'base_uri' => $this->apiUrl,
            'timeout' => 30,
            'verify' => false, // For staging environment
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]
        ]);

        // Get provider ID from database
        $provider = Db::table('game_providers')
            ->where('code', 'TOP')
            ->first();
        
        $this->providerId = $provider->id ?? 0;
    }

    /**
     * Generate HMAC-SHA256 signature for API requests
     * 
     * @param string $method HTTP method (GET, POST, etc.)
     * @param string $url Request URL path
     * @param string $timestamp Unix timestamp
     * @param string $body Request body (JSON string)
     * @return string HMAC signature
     */
    private function generateSignature(string $method, string $url, string $timestamp, string $body = ''): string
    {
        $stringToSign = $method . $url . $timestamp . $body;
        return hash_hmac('sha256', $stringToSign, $this->apiSecret);
    }

    /**
     * Make HTTP request to TOP Provider API
     * 
     * @param string $method HTTP method
     * @param string $endpoint API endpoint path
     * @param array $data Request payload
     * @return array Response data
     * @throws \Exception
     */
    private function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        try {
            $timestamp = (string)time();
            $body = !empty($data) ? json_encode($data) : '';
            $signature = $this->generateSignature($method, $endpoint, $timestamp, $body);

            $options = [
                'headers' => [
                    'X-Operator-Id' => $this->operatorId,
                    'X-API-Key' => $this->apiKey,
                    'X-Timestamp' => $timestamp,
                    'X-Signature' => $signature,
                ]
            ];

            if (!empty($data)) {
                $options['json'] = $data;
            }

            Log::info('TOP Provider Request', [
                'method' => $method,
                'endpoint' => $endpoint,
                'data' => $data,
                'timestamp' => $timestamp
            ]);

            $response = $this->httpClient->request($method, $endpoint, $options);
            $responseBody = $response->getBody()->getContents();
            $result = json_decode($responseBody, true);

            Log::info('TOP Provider Response', [
                'endpoint' => $endpoint,
                'status' => $response->getStatusCode(),
                'response' => $result
            ]);

            return $result;

        } catch (GuzzleException $e) {
            Log::error('TOP Provider API Error', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new \Exception('Provider API request failed: ' . $e->getMessage());
        }
    }

    /**
     * Get game list from TOP Provider
     * 
     * @return array List of games
     */
    public function getGameList(): array
    {
        try {
            $response = $this->makeRequest('GET', '/games/list');

            if (isset($response['status']) && $response['status'] === 'success') {
                return $response['data'] ?? [];
            }

            throw new \Exception('Failed to fetch game list: ' . ($response['message'] ?? 'Unknown error'));

        } catch (\Exception $e) {
            Log::error('Failed to get game list', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Synchronize games from provider to local database
     * 
     * @return array Sync statistics
     */
    public function syncGames(): array
    {
        try {
            $games = $this->getGameList();
            $inserted = 0;
            $updated = 0;
            $errors = 0;

            foreach ($games as $game) {
                try {
                    $gameData = [
                        'provider_id' => $this->providerId,
                        'game_code' => $game['game_code'] ?? '',
                        'game_name' => $game['game_name'] ?? '',
                        'game_name_vi' => $game['game_name_vi'] ?? $game['game_name'] ?? '',
                        'game_type' => $game['game_type'] ?? 'slot',
                        'category_id' => $game['category'] ?? 'SLOT',
                        'thumbnail' => $game['thumbnail'] ?? null,
                        'image_url' => $game['image_url'] ?? $game['thumbnail'] ?? null,
                        'rtp' => $game['rtp'] ?? null,
                        'volatility' => $game['volatility'] ?? null,
                        'max_win' => $game['max_win'] ?? null,
                        'is_active' => 1,
                        'is_hot' => $game['is_hot'] ?? 0,
                        'is_new' => $game['is_new'] ?? 0,
                        'updated_at' => date('Y-m-d H:i:s')
                    ];

                    $existing = Db::table('games')
                        ->where('provider_id', $this->providerId)
                        ->where('game_code', $gameData['game_code'])
                        ->first();

                    if ($existing) {
                        Db::table('games')
                            ->where('id', $existing->id)
                            ->update($gameData);
                        $updated++;
                    } else {
                        $gameData['created_at'] = date('Y-m-d H:i:s');
                        Db::table('games')->insert($gameData);
                        $inserted++;
                    }

                } catch (\Exception $e) {
                    $errors++;
                    Log::error('Failed to sync game', [
                        'game' => $game,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Clear cache
            Redis::del('top_provider_games_list');

            return [
                'total' => count($games),
                'inserted' => $inserted,
                'updated' => $updated,
                'errors' => $errors
            ];

        } catch (\Exception $e) {
            Log::error('Game sync failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Launch game and get play URL
     * 
     * @param int $userId User ID
     * @param string $gameCode Game code
     * @return array Launch data with game_url and session_id
     */
    public function launchGame(int $userId, string $gameCode): array
    {
        try {
            // Get game details
            $game = Db::table('games')
                ->where('provider_id', $this->providerId)
                ->where('game_code', $gameCode)
                ->where('is_active', 1)
                ->first();

            if (!$game) {
                throw new \Exception('Game not found or inactive');
            }

            // Prepare launch request
            $requestData = [
                'operator_id' => $this->operatorId,
                'player_id' => 'user_' . $userId,
                'game_code' => $gameCode,
                'currency' => $this->currency,
                'language' => $this->language,
                'return_url' => 'https://boyue.okwink6.com/games'
            ];

            $response = $this->makeRequest('POST', '/game/launch', $requestData);

            if (isset($response['status']) && $response['status'] === 'success') {
                $data = $response['data'];
                
                // Save session to database
                Db::table('game_sessions')->insert([
                    'user_id' => $userId,
                    'game_id' => $game->id,
                    'provider_id' => $this->providerId,
                    'session_id' => $data['session_id'] ?? '',
                    'game_url' => $data['game_url'] ?? '',
                    'status' => 'active',
                    'created_at' => date('Y-m-d H:i:s'),
                    'expired_at' => date('Y-m-d H:i:s', strtotime('+4 hours'))
                ]);

                // Update play count
                Db::table('games')
                    ->where('id', $game->id)
                    ->increment('play_count');

                return [
                    'game_url' => $data['game_url'] ?? '',
                    'session_id' => $data['session_id'] ?? '',
                    'game_name' => $game->game_name,
                    'provider' => 'TOP'
                ];
            }

            throw new \Exception('Failed to launch game: ' . ($response['message'] ?? 'Unknown error'));

        } catch (\Exception $e) {
            Log::error('Game launch failed', [
                'user_id' => $userId,
                'game_code' => $gameCode,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get provider ID
     * 
     * @return int Provider ID
     */
    public function getProviderId(): int
    {
        return $this->providerId;
    }

    /**
     * Verify webhook signature
     * 
     * @param string $signature Signature from header
     * @param string $body Request body
     * @return bool True if valid
     */
    public function verifyWebhookSignature(string $signature, string $body): bool
    {
        $webhookSecret = getenv('TOP_PROVIDER_WEBHOOK_SECRET') ?: '';
        if (empty($webhookSecret)) {
            Log::warning('Webhook secret not configured');
            return true; // Allow in development
        }

        $expectedSignature = hash_hmac('sha256', $body, $webhookSecret);
        return hash_equals($expectedSignature, $signature);
    }
}

// Made with Bob
