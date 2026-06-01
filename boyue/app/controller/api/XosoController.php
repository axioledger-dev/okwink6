<?php

namespace app\controller\api;

use app\service\XosoService;
use support\Request;
use support\Log;

/**
 * Xổ Số API Controller
 * Handles all Xổ Số related API endpoints
 */
class XosoController
{
    /**
     * Get all active categories
     * 
     * GET /api/xoso/categories
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function categories(Request $request)
    {
        try {
            $categories = XosoService::getCategories();
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error('Get xoso categories failed: ' . $e->getMessage());
            return json([
                'code' => 500,
                'message' => 'Failed to get categories: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get provinces by category or all provinces
     * 
     * GET /api/xoso/provinces?category_code={code}
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function provinces(Request $request)
    {
        try {
            $categoryCode = $request->get('category_code');
            
            $provinces = XosoService::getProvinces($categoryCode);
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $provinces
            ]);
        } catch (\Exception $e) {
            Log::error('Get xoso provinces failed: ' . $e->getMessage());
            return json([
                'code' => 500,
                'message' => 'Failed to get provinces: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get draw schedule
     * 
     * GET /api/xoso/schedule?province_code={code}
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function schedule(Request $request)
    {
        try {
            $provinceCode = $request->get('province_code');
            
            $schedule = XosoService::getSchedule($provinceCode);
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $schedule
            ]);
        } catch (\Exception $e) {
            Log::error('Get xoso schedule failed: ' . $e->getMessage());
            return json([
                'code' => 500,
                'message' => 'Failed to get schedule: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get latest results
     * 
     * GET /api/xoso/latest-results?province_code={code}&limit={number}
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function latestResults(Request $request)
    {
        try {
            $provinceCode = $request->get('province_code');
            $limit = min(50, max(1, (int)$request->get('limit', 10)));
            
            $results = XosoService::getLatestResults($provinceCode, $limit);
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Get latest xoso results failed: ' . $e->getMessage());
            return json([
                'code' => 500,
                'message' => 'Failed to get latest results: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get result detail by ID
     * 
     * GET /api/xoso/result/{id}
     * 
     * @param Request $request
     * @param int $id
     * @return \support\Response
     */
    public function resultDetail(Request $request, $id)
    {
        try {
            $result = XosoService::getResultDetail((int)$id);
            
            if (!$result) {
                return json([
                    'code' => 404,
                    'message' => 'Result not found',
                    'data' => null
                ]);
            }
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('Get xoso result detail failed: ' . $e->getMessage());
            return json([
                'code' => 500,
                'message' => 'Failed to get result detail: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Place a bet
     * 
     * POST /api/xoso/bet
     * Body: {
     *   "province_code": "ha-noi",
     *   "bet_type": "de",
     *   "numbers": ["12", "34"],
     *   "amount": 10000,
     *   "result_date": "2026-05-22"
     * }
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function placeBet(Request $request)
    {
        $userId = $request->userId ?? 0;
        
        if (!$userId) {
            return json([
                'code' => 401,
                'message' => 'Unauthorized - Please login',
                'data' => null
            ]);
        }
        
        try {
            $params = $request->post();
            
            $bet = XosoService::placeBet($userId, $params);
            
            return json([
                'code' => 0,
                'message' => 'Bet placed successfully',
                'data' => $bet
            ]);
        } catch (\Exception $e) {
            Log::error('Place xoso bet failed: ' . $e->getMessage(), [
                'user_id' => $userId,
                'params' => $request->post()
            ]);
            return json([
                'code' => 500,
                'message' => 'Failed to place bet: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get user's bets
     * 
     * GET /api/xoso/my-bets?page=1&limit=20&status={pending|win|lose}&province_code={code}
     * 
     * @param Request $request
     * @return \support\Response
     */
    public function myBets(Request $request)
    {
        $userId = $request->userId ?? 0;
        
        if (!$userId) {
            return json([
                'code' => 401,
                'message' => 'Unauthorized - Please login',
                'data' => null
            ]);
        }
        
        try {
            $params = [
                'page' => $request->get('page', 1),
                'limit' => $request->get('limit', 20),
                'status' => $request->get('status'),
                'province_code' => $request->get('province_code')
            ];
            
            $result = XosoService::getUserBets($userId, $params);
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('Get user xoso bets failed: ' . $e->getMessage(), [
                'user_id' => $userId
            ]);
            return json([
                'code' => 500,
                'message' => 'Failed to get bets: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
    
    /**
     * Get bet detail
     * 
     * GET /api/xoso/bet/{id}
     * 
     * @param Request $request
     * @param int $id
     * @return \support\Response
     */
    public function betDetail(Request $request, $id)
    {
        $userId = $request->userId ?? 0;
        
        if (!$userId) {
            return json([
                'code' => 401,
                'message' => 'Unauthorized - Please login',
                'data' => null
            ]);
        }
        
        try {
            $bet = XosoService::getBetDetail($userId, (int)$id);
            
            if (!$bet) {
                return json([
                    'code' => 404,
                    'message' => 'Bet not found',
                    'data' => null
                ]);
            }
            
            return json([
                'code' => 0,
                'message' => 'Success',
                'data' => $bet
            ]);
        } catch (\Exception $e) {
            Log::error('Get xoso bet detail failed: ' . $e->getMessage(), [
                'user_id' => $userId,
                'bet_id' => $id
            ]);
            return json([
                'code' => 500,
                'message' => 'Failed to get bet detail: ' . $e->getMessage(),
                'data' => null
            ]);
        }
    }
}

// Made with Bob
