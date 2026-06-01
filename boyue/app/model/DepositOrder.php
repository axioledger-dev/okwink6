<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

/**
 * Deposit Order Model
 * Table: caipiao_deposit_orders
 */
class DepositOrder extends Model
{
    protected $table = 'caipiao_deposit_orders';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'order_no',
        'uid',
        'username',
        'amount',
        'currency',
        'status',
        'payment_method',
        'bank_id',
        'qr_session_id',
        'old_balance',
        'new_balance',
        'ip_address',
        'user_agent',
        'provider_order_id',
        'provider_response',
        'error_message',
        'expires_at',
        'paid_at',
        'created_at',
        'updated_at'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'old_balance' => 'decimal:2',
        'new_balance' => 'decimal:2',
        'expires_at' => 'integer',
        'paid_at' => 'integer',
        'created_at' => 'integer',
        'updated_at' => 'integer'
    ];
    
    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_WAITING_PAYMENT = 'waiting_payment';
    const STATUS_SUCCESS = 'success';
    const STATUS_FAILED = 'failed';
    const STATUS_EXPIRED = 'expired';
    const STATUS_CANCELLED = 'cancelled';
    
    /**
     * Generate unique order number
     */
    public static function generateOrderNo(int $uid): string
    {
        return 'DP' . date('YmdHis') . str_pad($uid, 4, '0', STR_PAD_LEFT) . mt_rand(1000, 9999);
    }
    
    /**
     * Check if order is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && time() > $this->expires_at;
    }
    
    /**
     * Check if order can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_WAITING_PAYMENT]);
    }
    
    /**
     * Get bank relationship
     */
    public function bank()
    {
        return $this->belongsTo(PaymentBank::class, 'bank_id');
    }
    
    /**
     * Get QR session relationship
     */
    public function qrSession()
    {
        return $this->hasOne(DepositQrSession::class, 'order_id');
    }
    
    /**
     * Get transactions relationship
     */
    public function transactions()
    {
        return $this->hasMany(DepositTransaction::class, 'order_id');
    }
}
