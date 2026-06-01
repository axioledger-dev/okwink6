<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

class XosoResult extends Model
{
    protected $table = 'caipiao_xoso_result';
    protected $primaryKey = 'id';
    public $timestamps = true;
    
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    
    protected $fillable = [
        'province_code',
        'result_date',
        'result_data',
        'status'
    ];
    
    protected $casts = [
        'result_data' => 'array',
        'result_date' => 'date',
    ];
    
    /**
     * Get province for this result
     */
    public function province()
    {
        return $this->belongsTo(XosoProvince::class, 'province_code', 'code');
    }
    
    /**
     * Scope to filter by province code
     */
    public function scopeByProvince($query, $provinceCode)
    {
        return $query->where('province_code', $provinceCode);
    }
    
    /**
     * Scope to filter by date
     */
    public function scopeByDate($query, $date)
    {
        return $query->where('result_date', $date);
    }
    
    /**
     * Scope to filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('result_date', [$startDate, $endDate]);
    }
    
    /**
     * Scope to get only completed results
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
    
    /**
     * Scope to order by date descending
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('result_date', 'desc');
    }
}

// Made with Bob
