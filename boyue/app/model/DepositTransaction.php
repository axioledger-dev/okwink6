<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

/**
 * Deposit Transaction Model
 * Table: caipiao_deposit_transactions
 */
class DepositTransaction extends Model
{
    protected $table = 'caipiao_deposit_transactions';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'order_id',
        'order_no',
        'uid',
        'transaction_type',
        'amount',
        'balance_before',
        'balance_after',
        'status',
        'provider_transaction_id',
        'remark',
        'metadata',
        'created_at'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'created_at' => 'integer'
    ];
    
    // Transaction types
    const TYPE_CREATE = 'create';
    const TYPE_SELECT_BANK = 'select_bank';
    const TYPE_PAYMENT = 'payment';
    const TYPE_CANCEL = 'cancel';
    const TYPE_EXPIRE = 'expire';
    
    /**
     * Get order relationship
     */
    public function order()
    {
        return $this->belongsTo(DepositOrder::class, 'order_id');
    }
}
