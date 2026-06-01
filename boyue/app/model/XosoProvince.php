<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

class XosoProvince extends Model
{
    protected $table = 'caipiao_xoso_province';
    protected $primaryKey = 'id';
    public $timestamps = true;
    
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    
    protected $fillable = [
        'category_code',
        'code',
        'name',
        'region',
        'status',
        'sort_order',
        'draw_time'
    ];
    
    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    /**
     * Get category for this province
     */
    public function category()
    {
        return $this->belongsTo(XosoCategory::class, 'category_code', 'code');
    }
    
    /**
     * Get results for this province
     */
    public function results()
    {
        return $this->hasMany(XosoResult::class, 'province_code', 'code');
    }
    
    /**
     * Get bets for this province
     */
    public function bets()
    {
        return $this->hasMany(XosoBet::class, 'province_code', 'code');
    }
    
    /**
     * Scope to get only active provinces
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
    
    /**
     * Scope to filter by region
     */
    public function scopeByRegion($query, $region)
    {
        return $query->where('region', $region);
    }
    
    /**
     * Scope to order by sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}

// Made with Bob
