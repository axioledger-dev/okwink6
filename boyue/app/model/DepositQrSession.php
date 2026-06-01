<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

/**
 * Deposit QR Session Model
 * Table: caipiao_deposit_qr_sessions
 */
class DepositQrSession extends Model
{
    protected $table = 'caipiao_deposit_qr_sessions';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'order_id',
        'order_no',
        'bank_id',
        'qr_code',
        'qr_type',
        'account_number',
        'account_name',
        'transfer_content',
        'amount',
        'provider_order_id',
        'provider_response',
        'provider_callback_url',
        'expires_at',
        'created_at'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'integer',
        'created_at' => 'integer'
    ];
    
    /**
     * Check if QR is expired
     */
    public function isExpired(): bool
    {
        return time() > $this->expires_at;
    }
    
    /**
     * Get order relationship
     */
    public function order()
    {
        return $this->belongsTo(DepositOrder::class, 'order_id');
    }
    
    /**
     * Get bank relationship
     */
    public function bank()
    {
        return $this->belongsTo(PaymentBank::class, 'bank_id');
    }
}
