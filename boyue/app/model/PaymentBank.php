<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

/**
 * Payment Bank Model
 * Table: caipiao_payment_banks
 */
class PaymentBank extends Model
{
    protected $table = 'caipiao_payment_banks';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'bank_code',
        'bank_name',
        'bank_name_en',
        'logo_url',
        'short_name',
        'sort_order',
        'is_active',
        'min_amount',
        'max_amount',
        'daily_limit',
        'fee_percent',
        'fee_fixed',
        'config',
        'created_at',
        'updated_at'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'daily_limit' => 'decimal:2',
        'fee_percent' => 'decimal:2',
        'fee_fixed' => 'decimal:2',
        'sort_order' => 'integer',
        'created_at' => 'integer',
        'updated_at' => 'integer'
    ];
    
    /**
     * Get active banks
     */
    public static function getActiveBanks()
    {
        return self::where('is_active', 1)
            ->orderBy('sort_order', 'asc')
            ->get();
    }
    
    /**
     * Get bank by code
     */
    public static function getByCode(string $code)
    {
        return self::where('bank_code', $code)
            ->where('is_active', 1)
            ->first();
    }
    
    /**
     * Validate amount
     */
    public function validateAmount(float $amount): bool
    {
        return $amount >= $this->min_amount && $amount <= $this->max_amount;
    }
    
    /**
     * Calculate fee
     */
    public function calculateFee(float $amount): float
    {
        return ($amount * $this->fee_percent / 100) + $this->fee_fixed;
    }
}
