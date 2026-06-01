<?php

namespace app\model;

use Illuminate\Database\Eloquent\Model;

/**
 * Payment Webhook Log Model
 * Table: caipiao_payment_webhook_logs
 */
class PaymentWebhookLog extends Model
{
    protected $table = 'caipiao_payment_webhook_logs';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    protected $fillable = [
        'order_no',
        'webhook_type',
        'provider',
        'request_method',
        'request_url',
        'request_headers',
        'request_body',
        'request_params',
        'response_body',
        'response_code',
        'signature',
        'signature_valid',
        'ip_address',
        'processed',
        'process_result',
        'error_message',
        'retry_count',
        'created_at',
        'processed_at'
    ];
    
    protected $casts = [
        'signature_valid' => 'boolean',
        'processed' => 'boolean',
        'response_code' => 'integer',
        'retry_count' => 'integer',
        'created_at' => 'integer',
        'processed_at' => 'integer'
    ];
    
    /**
     * Log webhook request
     */
    public static function logWebhook(array $data): int
    {
        $log = new self();
        $log->fill($data);
        $log->created_at = time();
        $log->save();
        
        return $log->id;
    }
    
    /**
     * Mark as processed
     */
    public function markAsProcessed(array $result = []): void
    {
        $this->processed = true;
        $this->processed_at = time();
        $this->process_result = json_encode($result, JSON_UNESCAPED_UNICODE);
        $this->save();
    }
    
    /**
     * Increment retry count
     */
    public function incrementRetry(): void
    {
        $this->retry_count++;
        $this->save();
    }
}
