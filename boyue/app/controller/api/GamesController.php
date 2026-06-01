<?php

namespace app\controller\api;

use support\Request;
use support\Response;
use support\Db;
use support\Log;
use app\model\Game;
use app\model\GameCategory;
use app\model\WinLog;
use app\model\Announcement;
use app\model\UserFavorite;
use app\service\games\TopProviderAdapter;

/**
 * Games API Controller
 * RESTful API endpoints for F168 Gaming Platform
 */
class GamesController
{
    /**
     * Get all game categories
     * GET /api/v1/categories
     */
    public function categories(Request $request): Response
    {
        try {
            $categories = Db::table('game_categories')
                ->where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get games list with filters
     * GET /api/v1/games
     * Query params: category, page, limit, is_hot, is_new
     */
    public function index(Request $request): Response
    {
        try {
            $category = $request->get('category');
            $page = max(1, (int)$request->get('page', 1));
            $limit = min(100, max(1, (int)$request->get('limit', 30)));
            $isHot = $request->get('is_hot');
            $isNew = $request->get('is_new');

            $query = Db::table('games')
                ->where('is_active', true);

            // Filter by category
            if ($category && $category !== 'ALL') {
                $query->where('category_id', $category);
            }

            // Filter by hot games
            if ($isHot !== null) {
                $query->where('is_hot', (bool)$isHot);
            }

            // Filter by new games
            if ($isNew !== null) {
                $query->where('is_new', (bool)$isNew);
            }

            // Get total count
            $total = $query->count();

            // Get paginated results
            $games = $query
                ->orderBy('sort_order', 'asc')
                ->orderBy('play_count', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $games,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch games',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get game details by ID
     * GET /api/v1/games/{id}
     */
    public function show(Request $request, $id): Response
    {
        try {
            $game = Db::table('games')
                ->where('game_id', $id)
                ->where('is_active', true)
                ->first();

            if (!$game) {
                return json([
                    'code' => 404,
                    'message' => 'Game not found'
                ], 404);
            }

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $game
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch game details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Launch game and get play URL
     * POST /api/v1/games/launch
     * Body: { game_id, game_code }
     */
    public function launch(Request $request): Response
    {
        try {
            $userId = $request->user_id ?? null;
            if (!$userId) {
                return json([
                    'code' => 401,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $gameId = $request->post('game_id');
            $gameCode = $request->post('game_code');

            if (!$gameId || !$gameCode) {
                return json([
                    'code' => 400,
                    'message' => 'Missing required parameters'
                ], 400);
            }

            // Get game details
            $game = Db::table('games')
                ->where('game_id', $gameId)
                ->where('is_active', true)
                ->first();

            if (!$game) {
                return json([
                    'code' => 404,
                    'message' => 'Game not found'
                ], 404);
            }

            // Check if game is from TOP Provider
            $provider = Db::table('game_providers')
                ->where('id', $game->provider_id ?? 0)
                ->first();

            if ($provider && $provider->code === 'TOP') {
                // Use TOP Provider Adapter
                try {
                    $adapter = new TopProviderAdapter();
                    $launchData = $adapter->launchGame($userId, $gameCode);
                    
                    return json([
                        'code' => 0,
                        'message' => 'Success',
                        'data' => $launchData
                    ]);
                } catch (\Exception $e) {
                    Log::error('TOP Provider launch failed', [
                        'user_id' => $userId,
                        'game_code' => $gameCode,
                        'error' => $e->getMessage()
                    ]);
                    
                    return json([
                        'code' => 500,
                        'message' => 'Failed to launch game: ' . $e->getMessage()
                    ], 500);
                }
            }

            // Update play count for non-TOP games
            Db::table('games')
                ->where('game_id', $gameId)
                ->increment('play_count');

            // Generate launch URL for other providers
            $launchUrl = $this->generateLaunchUrl($userId, $game);

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => [
                    'launch_url' => $launchUrl,
                    'game_name' => $game->game_name,
                    'provider' => $game->provider ?? 'Unknown'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Game launch failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return json([
                'code' => 500,
                'message' => 'Failed to launch game',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle game favorite status
     * POST /api/v1/games/favorite
     * Body: { game_id, is_favorite }
     */
    public function favorite(Request $request): Response
    {
        try {
            $userId = $request->user_id ?? null;
            if (!$userId) {
                return json([
                    'code' => 401,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $gameId = $request->post('game_id');
            $isFavorite = $request->post('is_favorite');

            if ($isFavorite) {
                // Add to favorites
                Db::table('user_favorites')->insertOrIgnore([
                    'user_id' => $userId,
                    'game_id' => $gameId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            } else {
                // Remove from favorites
                Db::table('user_favorites')
                    ->where('user_id', $userId)
                    ->where('game_id', $gameId)
                    ->delete();
            }

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => [
                    'is_favorite' => $isFavorite
                ]
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to update favorite',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's favorite games
     * GET /api/v1/games/favorites
     */
    public function favorites(Request $request): Response
    {
        try {
            $userId = $request->user_id ?? null;
            if (!$userId) {
                return json([
                    'code' => 401,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $page = max(1, (int)$request->get('page', 1));
            $limit = min(100, max(1, (int)$request->get('limit', 30)));

            $games = Db::table('games')
                ->join('user_favorites', 'games.game_id', '=', 'user_favorites.game_id')
                ->where('user_favorites.user_id', $userId)
                ->where('games.is_active', true)
                ->select('games.*')
                ->orderBy('user_favorites.created_at', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $games
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch favorites',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get hot games (most played)
     * GET /api/v1/games/hot
     */
    public function hot(Request $request): Response
    {
        try {
            $limit = min(50, max(1, (int)$request->get('limit', 20)));

            $games = Db::table('games')
                ->where('is_active', true)
                ->where('is_hot', true)
                ->orderBy('play_count', 'desc')
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $games
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch hot games',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search games by keyword
     * GET /api/v1/games/search
     */
    public function search(Request $request): Response
    {
        try {
            $keyword = $request->get('keyword', '');
            $page = max(1, (int)$request->get('page', 1));
            $limit = min(100, max(1, (int)$request->get('limit', 30)));

            if (empty($keyword)) {
                return json([
                    'code' => 400,
                    'message' => 'Keyword is required'
                ], 400);
            }

            $games = Db::table('games')
                ->where('is_active', true)
                ->where(function($query) use ($keyword) {
                    $query->where('game_name', 'like', "%{$keyword}%")
                          ->orWhere('game_name_vi', 'like', "%{$keyword}%")
                          ->orWhere('provider', 'like', "%{$keyword}%");
                })
                ->orderBy('play_count', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $games
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to search games',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent big wins for live ticker
     * GET /api/v1/live-winners
     */
    public function liveWinners(Request $request): Response
    {
        try {
            $limit = min(100, max(1, (int)$request->get('limit', 50)));

            $wins = Db::table('win_logs')
                ->leftJoin('games', 'win_logs.game_id', '=', 'games.game_id')
                ->select(
                    'win_logs.*',
                    'games.image_url as game_image'
                )
                ->where('win_logs.created_at', '>=', date('Y-m-d H:i:s', strtotime('-1 hour')))
                ->orderBy('win_logs.created_at', 'desc')
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $wins
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch live winners',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system announcements
     * GET /api/v1/announcements
     */
    public function announcements(Request $request): Response
    {
        try {
            $page = max(1, (int)$request->get('page', 1));
            $limit = min(50, max(1, (int)$request->get('limit', 5)));

            $now = date('Y-m-d H:i:s');

            $announcements = Db::table('announcements')
                ->where('is_active', true)
                ->where(function($query) use ($now) {
                    $query->whereNull('start_at')
                          ->orWhere('start_at', '<=', $now);
                })
                ->where(function($query) use ($now) {
                    $query->whereNull('end_at')
                          ->orWhere('end_at', '>=', $now);
                })
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $announcements
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'message' => 'Failed to fetch announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate game launch URL
     * This is a placeholder - integrate with actual game provider APIs
     */
    private function generateLaunchUrl($userId, $game): string
    {
        // TODO: Integrate with game provider APIs (PG, SEXY, DG, etc.)
        // Each provider has different authentication and launch mechanisms
        
        $baseUrl = config('app.game_launch_url', 'https://game.example.com');
        $token = $this->generateGameToken($userId, $game->game_id);
        
        return "{$baseUrl}/launch?token={$token}&game={$game->game_code}&provider={$game->provider}";
    }

    /**
     * Generate secure game token
     */
    private function generateGameToken($userId, $gameId): string
    {
        $data = [
            'user_id' => $userId,
            'game_id' => $gameId,
            'timestamp' => time(),
            'random' => bin2hex(random_bytes(16))
        ];
        
        return base64_encode(json_encode($data));
    }
}

// Made with Bob
