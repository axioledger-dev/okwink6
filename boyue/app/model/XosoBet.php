<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

class XosoBet extends Model
{
    protected $table = 'caipiao_xoso_bet';
    protected $primaryKey = 'id';
    public $timestamps = true;
    
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    
    protected $fillable = [
        'user_id',
        'order_no',
        'province_code',
        'bet_type',
        'numbers',
        'amount',
        'total_amount',
        'status',
        'result_date',
        'raw_data'
    ];
    
    protected $casts = [
        'numbers' => 'array',
        'raw_data' => 'array',
        'amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'result_date' => 'date',
    ];
    
    /**
     * Get province for this bet
     */
    public function province()
    {
        return $this->belongsTo(XosoProvince::class, 'province_code', 'code');
    }
    
    /**
     * Scope to filter by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    /**
     * Scope to filter by province
     */
    public function scopeByProvince($query, $provinceCode)
    {
        return $query->where('province_code', $provinceCode);
    }
    
    /**
     * Scope to filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
    
    /**
     * Scope to get pending bets
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    
    /**
     * Scope to get winning bets
     */
    public function scopeWin($query)
    {
        return $query->where('status', 'win');
    }
    
    /**
     * Scope to get losing bets
     */
    public function scopeLose($query)
    {
        return $query->where('status', 'lose');
    }
    
    /**
     * Scope to order by created_at descending
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
    
    /**
     * Scope to filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}

// Made with Bob
