<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

class XosoCategory extends Model
{
    protected $table = 'caipiao_xoso_category';
    protected $primaryKey = 'id';
    public $timestamps = true;
    
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    
    protected $fillable = [
        'code',
        'name',
        'region',
        'status',
        'sort_order'
    ];
    
    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    /**
     * Get provinces for this category
     */
    public function provinces()
    {
        return $this->hasMany(XosoProvince::class, 'category_code', 'code');
    }
    
    /**
     * Scope to get only active categories
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
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
