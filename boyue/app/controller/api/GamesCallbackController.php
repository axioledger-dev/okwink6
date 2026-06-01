<?php

namespace app\controller\api;

use support\Request;
use support\Response;
use support\Db;
use support\Log;
use app\service\games\TopProviderAdapter;

/**
 * Games Callback Controller
 * Handles seamless wallet callbacks from TOP Provider
 * Implements idempotency and transaction safety
 */
class GamesCallbackController
{
    private TopProviderAdapter $adapter;

    public function __construct()
    {
        $this->adapter = new TopProviderAdapter();
    }

    /**
     * Verify webhook signature
     * 
     * @param Request $request
     * @return bool
     */
    private function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Signature', '');
        $body = $request->rawBody();
        
        return $this->adapter->verifyWebhookSignature($signature, $body);
    }

    /**
     * Get user balance
     * 
     * @param int $userId
     * @return float
     */
    private function getUserBalance(int $userId): float
    {
        $user = Db::table('users')
            ->where('id', $userId)
            ->first();
        
        return $user ? (float)$user->balance : 0.0;
    }

    /**
     * Check if transaction already processed (Idempotency)
     * 
     * @param int $providerId
     * @param string $providerTxnId
     * @return array|null Existing transaction or null
     */
    private function checkExistingTransaction(int $providerId, string $providerTxnId): ?array
    {
        $existing = Db::table('game_transactions')
            ->where('provider_id', $providerId)
            ->where('provider_txn_id', $providerTxnId)
            ->where('status', 'completed')
            ->first();
        
        return $existing ? (array)$existing : null;
    }

    /**
     * Handle bet callback
     * POST /api/games/callback/bet
     * 
     * @param Request $request
     * @return Response
     */
    public function bet(Request $request): Response
    {
        try {
            // Verify signature
            if (!$this->verifySignature($request)) {
                Log::warning('Invalid webhook signature for bet callback');
                return json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 401);
            }

            $data = $request->post();
            Log::info('Bet Callback Received', ['data' => $data]);

            // Extract parameters
            $playerIdStr = $data['player_id'] ?? '';
            $userId = (int)str_replace('user_', '', $playerIdStr);
            $gameRoundId = $data['game_round_id'] ?? '';
            $betAmount = (float)($data['bet_amount'] ?? 0);
            $gameCode = $data['game_code'] ?? '';
            $providerTxnId = $data['transaction_id'] ?? '';

            // Validate parameters
            if (!$userId || !$gameRoundId || $betAmount <= 0) {
                return json([
                    'status' => 'error',
                    'message' => 'Invalid parameters'
                ], 400);
            }

            // Check idempotency
            $existing = $this->checkExistingTransaction($this->adapter->getProviderId(), $providerTxnId);
            if ($existing) {
                Log::info('Bet already processed (idempotent)', ['txn_id' => $providerTxnId]);
                return json([
                    'status' => 'success',
                    'balance' => $existing['balance_after'],
                    'transaction_id' => $existing['id']
                ]);
            }

            // Get game
            $game = Db::table('games')
                ->where('provider_id', $this->adapter->getProviderId())
                ->where('game_code', $gameCode)
                ->first();

            if (!$game) {
                return json([
                    'status' => 'error',
                    'message' => 'Game not found'
                ], 404);
            }

            // Start database transaction
            Db::beginTransaction();

            try {
                // Lock user row and get balance
                $user = Db::table('users')
                    ->where('id', $userId)
                    ->lockForUpdate()
                    ->first();

                if (!$user) {
                    Db::rollBack();
                    return json([
                        'status' => 'error',
                        'message' => 'User not found'
                    ], 404);
                }

                $balanceBefore = (float)$user->balance;

                // Check sufficient balance
                if ($balanceBefore < $betAmount) {
                    Db::rollBack();
                    return json([
                        'status' => 'error',
                        'message' => 'Insufficient balance',
                        'balance' => $balanceBefore
                    ], 400);
                }

                // Deduct balance
                $balanceAfter = $balanceBefore - $betAmount;
                Db::table('users')
                    ->where('id', $userId)
                    ->update(['balance' => $balanceAfter]);

                // Record transaction
                $txnId = Db::table('game_transactions')->insertGetId([
                    'user_id' => $userId,
                    'game_id' => $game->id,
                    'provider_id' => $this->adapter->getProviderId(),
                    'game_round_id' => $gameRoundId,
                    'transaction_type' => 'bet',
                    'amount' => $betAmount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'status' => 'completed',
                    'provider_txn_id' => $providerTxnId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);

                // Create or update game round
                $round = Db::table('game_rounds')
                    ->where('round_id', $gameRoundId)
                    ->first();

                if ($round) {
                    Db::table('game_rounds')
                        ->where('round_id', $gameRoundId)
                        ->update([
                            'bet_amount' => Db::raw('bet_amount + ' . $betAmount)
                        ]);
                } else {
                    Db::table('game_rounds')->insert([
                        'user_id' => $userId,
                        'game_id' => $game->id,
                        'provider_id' => $this->adapter->getProviderId(),
                        'round_id' => $gameRoundId,
                        'bet_amount' => $betAmount,
                        'win_amount' => 0,
                        'status' => 'active',
                        'started_at' => date('Y-m-d H:i:s')
                    ]);
                }

                Db::commit();

                Log::info('Bet processed successfully', [
                    'user_id' => $userId,
                    'amount' => $betAmount,
                    'balance_after' => $balanceAfter,
                    'txn_id' => $txnId
                ]);

                return json([
                    'status' => 'success',
                    'balance' => $balanceAfter,
                    'transaction_id' => $txnId
                ]);

            } catch (\Exception $e) {
                Db::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Bet callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Handle result/win callback
     * POST /api/games/callback/result
     * 
     * @param Request $request
     * @return Response
     */
    public function result(Request $request): Response
    {
        try {
            // Verify signature
            if (!$this->verifySignature($request)) {
                Log::warning('Invalid webhook signature for result callback');
                return json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 401);
            }

            $data = $request->post();
            Log::info('Result Callback Received', ['data' => $data]);

            // Extract parameters
            $playerIdStr = $data['player_id'] ?? '';
            $userId = (int)str_replace('user_', '', $playerIdStr);
            $gameRoundId = $data['game_round_id'] ?? '';
            $winAmount = (float)($data['win_amount'] ?? 0);
            $gameCode = $data['game_code'] ?? '';
            $providerTxnId = $data['transaction_id'] ?? '';

            // Validate parameters
            if (!$userId || !$gameRoundId) {
                return json([
                    'status' => 'error',
                    'message' => 'Invalid parameters'
                ], 400);
            }

            // Check idempotency
            $existing = $this->checkExistingTransaction($this->adapter->getProviderId(), $providerTxnId);
            if ($existing) {
                Log::info('Result already processed (idempotent)', ['txn_id' => $providerTxnId]);
                return json([
                    'status' => 'success',
                    'balance' => $existing['balance_after'],
                    'transaction_id' => $existing['id']
                ]);
            }

            // Get game
            $game = Db::table('games')
                ->where('provider_id', $this->adapter->getProviderId())
                ->where('game_code', $gameCode)
                ->first();

            if (!$game) {
                return json([
                    'status' => 'error',
                    'message' => 'Game not found'
                ], 404);
            }

            // Start database transaction
            Db::beginTransaction();

            try {
                // Check if round already settled
                $round = Db::table('game_rounds')
                    ->where('round_id', $gameRoundId)
                    ->lockForUpdate()
                    ->first();

                if (!$round) {
                    Db::rollBack();
                    return json([
                        'status' => 'error',
                        'message' => 'Round not found'
                    ], 404);
                }

                if ($round->status === 'settled') {
                    Db::rollBack();
                    Log::warning('Round already settled', ['round_id' => $gameRoundId]);
                    
                    // Return current balance
                    $balance = $this->getUserBalance($userId);
                    return json([
                        'status' => 'success',
                        'balance' => $balance,
                        'message' => 'Round already settled'
                    ]);
                }

                // Lock user row and get balance
                $user = Db::table('users')
                    ->where('id', $userId)
                    ->lockForUpdate()
                    ->first();

                if (!$user) {
                    Db::rollBack();
                    return json([
                        'status' => 'error',
                        'message' => 'User not found'
                    ], 404);
                }

                $balanceBefore = (float)$user->balance;
                $balanceAfter = $balanceBefore + $winAmount;

                // Add win amount to balance
                if ($winAmount > 0) {
                    Db::table('users')
                        ->where('id', $userId)
                        ->update(['balance' => $balanceAfter]);
                }

                // Record transaction
                $txnId = Db::table('game_transactions')->insertGetId([
                    'user_id' => $userId,
                    'game_id' => $game->id,
                    'provider_id' => $this->adapter->getProviderId(),
                    'game_round_id' => $gameRoundId,
                    'transaction_type' => 'win',
                    'amount' => $winAmount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'status' => 'completed',
                    'provider_txn_id' => $providerTxnId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);

                // Update round status
                Db::table('game_rounds')
                    ->where('round_id', $gameRoundId)
                    ->update([
                        'win_amount' => $winAmount,
                        'status' => 'settled',
                        'settled_at' => date('Y-m-d H:i:s')
                    ]);

                // Log big win for ticker
                if ($winAmount >= 1000000) { // 1M VND threshold
                    Db::table('win_logs')->insert([
                        'user_id' => $userId,
                        'username' => $user->username ?? 'Player',
                        'game_id' => $game->id,
                        'game_name' => $game->game_name,
                        'win_amount' => $winAmount,
                        'created_at' => date('Y-m-d H:i:s')
                    ]);
                }

                Db::commit();

                Log::info('Result processed successfully', [
                    'user_id' => $userId,
                    'win_amount' => $winAmount,
                    'balance_after' => $balanceAfter,
                    'txn_id' => $txnId
                ]);

                return json([
                    'status' => 'success',
                    'balance' => $balanceAfter,
                    'transaction_id' => $txnId
                ]);

            } catch (\Exception $e) {
                Db::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Result callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Handle refund callback
     * POST /api/games/callback/refund
     * 
     * @param Request $request
     * @return Response
     */
    public function refund(Request $request): Response
    {
        try {
            // Verify signature
            if (!$this->verifySignature($request)) {
                Log::warning('Invalid webhook signature for refund callback');
                return json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 401);
            }

            $data = $request->post();
            Log::info('Refund Callback Received', ['data' => $data]);

            // Extract parameters
            $playerIdStr = $data['player_id'] ?? '';
            $userId = (int)str_replace('user_', '', $playerIdStr);
            $gameRoundId = $data['game_round_id'] ?? '';
            $refundAmount = (float)($data['refund_amount'] ?? 0);
            $gameCode = $data['game_code'] ?? '';
            $providerTxnId = $data['transaction_id'] ?? '';

            // Validate parameters
            if (!$userId || !$gameRoundId || $refundAmount <= 0) {
                return json([
                    'status' => 'error',
                    'message' => 'Invalid parameters'
                ], 400);
            }

            // Check idempotency
            $existing = $this->checkExistingTransaction($this->adapter->getProviderId(), $providerTxnId);
            if ($existing) {
                Log::info('Refund already processed (idempotent)', ['txn_id' => $providerTxnId]);
                return json([
                    'status' => 'success',
                    'balance' => $existing['balance_after'],
                    'transaction_id' => $existing['id']
                ]);
            }

            // Get game
            $game = Db::table('games')
                ->where('provider_id', $this->adapter->getProviderId())
                ->where('game_code', $gameCode)
                ->first();

            if (!$game) {
                return json([
                    'status' => 'error',
                    'message' => 'Game not found'
                ], 404);
            }

            // Start database transaction
            Db::beginTransaction();

            try {
                // Lock user row and get balance
                $user = Db::table('users')
                    ->where('id', $userId)
                    ->lockForUpdate()
                    ->first();

                if (!$user) {
                    Db::rollBack();
                    return json([
                        'status' => 'error',
                        'message' => 'User not found'
                    ], 404);
                }

                $balanceBefore = (float)$user->balance;
                $balanceAfter = $balanceBefore + $refundAmount;

                // Add refund to balance
                Db::table('users')
                    ->where('id', $userId)
                    ->update(['balance' => $balanceAfter]);

                // Record transaction
                $txnId = Db::table('game_transactions')->insertGetId([
                    'user_id' => $userId,
                    'game_id' => $game->id,
                    'provider_id' => $this->adapter->getProviderId(),
                    'game_round_id' => $gameRoundId,
                    'transaction_type' => 'refund',
                    'amount' => $refundAmount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'status' => 'completed',
                    'provider_txn_id' => $providerTxnId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);

                // Update round status to cancelled
                Db::table('game_rounds')
                    ->where('round_id', $gameRoundId)
                    ->update([
                        'status' => 'cancelled',
                        'settled_at' => date('Y-m-d H:i:s')
                    ]);

                Db::commit();

                Log::info('Refund processed successfully', [
                    'user_id' => $userId,
                    'refund_amount' => $refundAmount,
                    'balance_after' => $balanceAfter,
                    'txn_id' => $txnId
                ]);

                return json([
                    'status' => 'success',
                    'balance' => $balanceAfter,
                    'transaction_id' => $txnId
                ]);

            } catch (\Exception $e) {
                Db::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Refund callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Handle balance check callback
     * POST /api/games/callback/balance
     * 
     * @param Request $request
     * @return Response
     */
    public function balance(Request $request): Response
    {
        try {
            // Verify signature
            if (!$this->verifySignature($request)) {
                Log::warning('Invalid webhook signature for balance callback');
                return json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 401);
            }

            $data = $request->post();
            Log::info('Balance Callback Received', ['data' => $data]);

            // Extract parameters
            $playerIdStr = $data['player_id'] ?? '';
            $userId = (int)str_replace('user_', '', $playerIdStr);

            if (!$userId) {
                return json([
                    'status' => 'error',
                    'message' => 'Invalid player_id'
                ], 400);
            }

            // Get user balance
            $balance = $this->getUserBalance($userId);

            return json([
                'status' => 'success',
                'balance' => $balance,
                'currency' => 'VNDK'
            ]);

        } catch (\Exception $e) {
            Log::error('Balance callback error', [
                'error' => $e->getMessage()
            ]);
            
            return json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }
}

// Made with Bob
