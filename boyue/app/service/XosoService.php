<?php

namespace app\service;

use app\model\XosoCategory;
use app\model\XosoProvince;
use app\model\XosoResult;
use app\model\XosoBet;
use support\Db;
use support\Log;

/**
 * Xổ Số Service
 * Business logic for Xổ Số operations
 */
class XosoService
{
    /**
     * Get all active categories
     * 
     * @return array
     */
    public static function getCategories(): array
    {
        try {
            $categories = XosoCategory::active()
                ->ordered()
                ->get()
                ->toArray();
            
            return $categories;
        } catch (\Exception $e) {
            Log::error('Failed to get xoso categories: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get provinces by category code or all provinces
     * 
     * @param string|null $categoryCode
     * @return array
     */
    public static function getProvinces(?string $categoryCode = null): array
    {
        try {
            $query = XosoProvince::active()->ordered();
            
            if ($categoryCode) {
                $query->where('category_code', $categoryCode);
            }
            
            $provinces = $query->get()->toArray();
            
            return $provinces;
        } catch (\Exception $e) {
            Log::error('Failed to get xoso provinces: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get draw schedule for provinces
     * 
     * @param string|null $provinceCode
     * @return array
     */
    public static function getSchedule(?string $provinceCode = null): array
    {
        try {
            $query = XosoProvince::active()->ordered();
            
            if ($provinceCode) {
                $query->where('code', $provinceCode);
            }
            
            $provinces = $query->get();
            
            $schedule = [];
            foreach ($provinces as $province) {
                $schedule[] = [
                    'province_code' => $province->code,
                    'province_name' => $province->name,
                    'region' => $province->region,
                    'draw_time' => $province->draw_time,
                    'next_draw' => self::calculateNextDraw($province->draw_time)
                ];
            }
            
            return $schedule;
        } catch (\Exception $e) {
            Log::error('Failed to get xoso schedule: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get latest results
     * 
     * @param string|null $provinceCode
     * @param int $limit
     * @return array
     */
    public static function getLatestResults(?string $provinceCode = null, int $limit = 10): array
    {
        try {
            $query = XosoResult::completed()->latest();
            
            if ($provinceCode) {
                $query->byProvince($provinceCode);
            }
            
            $results = $query->limit($limit)->get();
            
            $data = [];
            foreach ($results as $result) {
                $data[] = [
                    'id' => $result->id,
                    'province_code' => $result->province_code,
                    'province_name' => $result->province->name ?? '',
                    'result_date' => $result->result_date->format('Y-m-d'),
                    'result_data' => $result->result_data,
                    'status' => $result->status
                ];
            }
            
            return $data;
        } catch (\Exception $e) {
            Log::error('Failed to get latest xoso results: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get result detail by ID
     * 
     * @param int $id
     * @return array|null
     */
    public static function getResultDetail(int $id): ?array
    {
        try {
            $result = XosoResult::with('province')->find($id);
            
            if (!$result) {
                return null;
            }
            
            return [
                'id' => $result->id,
                'province_code' => $result->province_code,
                'province_name' => $result->province->name ?? '',
                'region' => $result->province->region ?? '',
                'result_date' => $result->result_date->format('Y-m-d'),
                'result_data' => $result->result_data,
                'status' => $result->status,
                'created_at' => $result->created_at->format('Y-m-d H:i:s')
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get xoso result detail: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Place a bet
     * 
     * @param int $userId
     * @param array $params
     * @return array
     */
    public static function placeBet(int $userId, array $params): array
    {
        try {
            // Validate required fields
            $required = ['province_code', 'bet_type', 'numbers', 'amount'];
            foreach ($required as $field) {
                if (!isset($params[$field])) {
                    throw new \Exception("Missing required field: {$field}");
                }
            }
            
            // Validate province exists
            $province = XosoProvince::where('code', $params['province_code'])
                ->where('status', 1)
                ->first();
            
            if (!$province) {
                throw new \Exception('Province not found or inactive');
            }
            
            // Validate numbers is array
            if (!is_array($params['numbers']) || empty($params['numbers'])) {
                throw new \Exception('Numbers must be a non-empty array');
            }
            
            // Validate amount
            $amount = floatval($params['amount']);
            if ($amount <= 0) {
                throw new \Exception('Amount must be greater than 0');
            }
            
            // Calculate total amount
            $totalAmount = $amount * count($params['numbers']);
            
            // Generate unique order number
            $orderNo = self::generateOrderNo();
            
            // TODO_WALLET_INTEGRATION: Check user balance before placing bet
            // TODO_WALLET_INTEGRATION: Deduct amount from user wallet
            // For now, we only save bet with status 'pending'
            
            // Create bet record
            $bet = XosoBet::create([
                'user_id' => $userId,
                'order_no' => $orderNo,
                'province_code' => $params['province_code'],
                'bet_type' => $params['bet_type'],
                'numbers' => $params['numbers'],
                'amount' => $amount,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'result_date' => $params['result_date'] ?? date('Y-m-d'),
                'raw_data' => $params
            ]);
            
            Log::info('Xoso bet placed', [
                'user_id' => $userId,
                'order_no' => $orderNo,
                'total_amount' => $totalAmount
            ]);
            
            return [
                'id' => $bet->id,
                'order_no' => $bet->order_no,
                'province_code' => $bet->province_code,
                'bet_type' => $bet->bet_type,
                'numbers' => $bet->numbers,
                'amount' => $bet->amount,
                'total_amount' => $bet->total_amount,
                'status' => $bet->status,
                'created_at' => $bet->created_at->format('Y-m-d H:i:s')
            ];
        } catch (\Exception $e) {
            Log::error('Failed to place xoso bet: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get user bets
     * 
     * @param int $userId
     * @param array $params
     * @return array
     */
    public static function getUserBets(int $userId, array $params = []): array
    {
        try {
            $page = $params['page'] ?? 1;
            $limit = min(50, $params['limit'] ?? 20);
            $status = $params['status'] ?? null;
            $provinceCode = $params['province_code'] ?? null;
            
            $query = XosoBet::byUser($userId)->latest();
            
            if ($status) {
                $query->byStatus($status);
            }
            
            if ($provinceCode) {
                $query->byProvince($provinceCode);
            }
            
            // Get total count
            $total = $query->count();
            
            // Get paginated results
            $bets = $query->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();
            
            $data = [];
            foreach ($bets as $bet) {
                $data[] = [
                    'id' => $bet->id,
                    'order_no' => $bet->order_no,
                    'province_code' => $bet->province_code,
                    'province_name' => $bet->province->name ?? '',
                    'bet_type' => $bet->bet_type,
                    'numbers' => $bet->numbers,
                    'amount' => $bet->amount,
                    'total_amount' => $bet->total_amount,
                    'status' => $bet->status,
                    'result_date' => $bet->result_date ? $bet->result_date->format('Y-m-d') : null,
                    'created_at' => $bet->created_at->format('Y-m-d H:i:s')
                ];
            }
            
            return [
                'total' => $total,
                'page' => (int)$page,
                'limit' => (int)$limit,
                'data' => $data
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get user xoso bets: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get bet detail
     * 
     * @param int $userId
     * @param int $id
     * @return array|null
     */
    public static function getBetDetail(int $userId, int $id): ?array
    {
        try {
            $bet = XosoBet::with('province')
                ->where('id', $id)
                ->where('user_id', $userId)
                ->first();
            
            if (!$bet) {
                return null;
            }
            
            return [
                'id' => $bet->id,
                'order_no' => $bet->order_no,
                'province_code' => $bet->province_code,
                'province_name' => $bet->province->name ?? '',
                'region' => $bet->province->region ?? '',
                'bet_type' => $bet->bet_type,
                'numbers' => $bet->numbers,
                'amount' => $bet->amount,
                'total_amount' => $bet->total_amount,
                'status' => $bet->status,
                'result_date' => $bet->result_date ? $bet->result_date->format('Y-m-d') : null,
                'raw_data' => $bet->raw_data,
                'created_at' => $bet->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $bet->updated_at->format('Y-m-d H:i:s')
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get xoso bet detail: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Generate unique order number
     * 
     * @return string
     */
    private static function generateOrderNo(): string
    {
        return 'XS' . date('YmdHis') . rand(1000, 9999);
    }
    
    /**
     * Calculate next draw time
     * 
     * @param string|null $drawTime
     * @return string|null
     */
    private static function calculateNextDraw(?string $drawTime): ?string
    {
        if (!$drawTime) {
            return null;
        }
        
        try {
            $today = date('Y-m-d');
            $nextDraw = $today . ' ' . $drawTime;
            
            // If draw time has passed today, set to tomorrow
            if (strtotime($nextDraw) < time()) {
                $nextDraw = date('Y-m-d', strtotime('+1 day')) . ' ' . $drawTime;
            }
            
            return $nextDraw;
        } catch (\Exception $e) {
            return null;
        }
    }
}

// Made with Bob
