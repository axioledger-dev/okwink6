# TOP Game Provider Integration - Implementation Summary

**Project:** BOYUE Platform  
**Provider:** TOP Game Provider  
**Integration Type:** Seamless Wallet (Single Wallet Mode)  
**Implementation Date:** 2026-06-01  
**Status:** ✅ Complete - Ready for Testing

---

## 📋 Overview

This document summarizes the complete implementation of TOP Game Provider integration into the BOYUE Platform using seamless wallet architecture. All components have been created and configured according to the official integration guide.

---

## 🎯 Implementation Checklist

### ✅ Completed Tasks

- [x] Database schema created with all required tables
- [x] Environment configuration added to `.env`
- [x] TopProviderAdapter service class implemented
- [x] GamesCallbackController created for seamless wallet
- [x] Route configuration updated with callback endpoints
- [x] GamesController integrated with TOP Provider
- [x] Signature generation and verification implemented
- [x] Transaction safety with database locking
- [x] Idempotency mechanism for duplicate requests
- [x] Comprehensive error logging

---

## 📁 Files Created/Modified

### New Files Created

1. **`boyue/scripts/top_provider_schema.sql`**
   - Complete database schema for TOP Provider
   - Tables: `game_providers`, `games`, `game_sessions`, `game_transactions`, `game_rounds`
   - Indexes for performance optimization
   - Initial provider configuration seeder

2. **`boyue/app/service/games/TopProviderAdapter.php`**
   - HTTP client for TOP Provider API communication
   - HMAC-SHA256 signature generation
   - Game list synchronization
   - Game launch functionality
   - Webhook signature verification

3. **`boyue/app/controller/api/GamesCallbackController.php`**
   - Bet callback handler with balance deduction
   - Result/Win callback handler with balance addition
   - Refund callback handler for cancelled rounds
   - Balance check callback handler
   - Full transaction safety with database locking
   - Idempotency checks to prevent duplicate processing

4. **`boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md`**
   - This implementation summary document

### Modified Files

1. **`boyue/.env`**
   - Added TOP Provider configuration variables
   - API credentials and endpoints configured

2. **`boyue/config/route.php`**
   - Added 4 callback route endpoints
   - Routes: `/api/games/callback/{bet,result,refund,balance}`

3. **`boyue/app/controller/api/GamesController.php`**
   - Integrated TOP Provider adapter in launch method
   - Added provider detection logic
   - Enhanced error logging

---

## 🔧 Configuration Details

### Environment Variables (`.env`)

```env
TOP_PROVIDER_API_URL=https://dcyqv8f2id.com/api/v2
TOP_PROVIDER_API_KEY=SQ9AHcmQT7tYTETknmtXzhOwYXuW6GY2
TOP_PROVIDER_API_SECRET=PLACEHOLDER_SECRET
TOP_PROVIDER_OPERATOR_ID=dj-stg-vndk3
TOP_PROVIDER_CURRENCY=VNDK
TOP_PROVIDER_LANGUAGE=vi
TOP_PROVIDER_CALLBACK_URL=https://boyue.okwink6.com/api/games/callback
TOP_PROVIDER_WEBHOOK_SECRET=PLACEHOLDER_WEBHOOK_SECRET
```

### Callback URLs Configured

| Callback Type | URL | Method |
|--------------|-----|--------|
| Bet (Deduct) | `https://boyue.okwink6.com/api/games/callback/bet` | POST |
| Result (Win) | `https://boyue.okwink6.com/api/games/callback/result` | POST |
| Refund | `https://boyue.okwink6.com/api/games/callback/refund` | POST |
| Balance Check | `https://boyue.okwink6.com/api/games/callback/balance` | POST |

---

## 🗄️ Database Schema

### Tables Created

1. **`game_providers`** - Provider configuration storage
2. **`games`** - Game catalog with provider linkage
3. **`game_sessions`** - Active game session tracking
4. **`game_transactions`** - All financial transactions log
5. **`game_rounds`** - Game round lifecycle tracking

### Key Features

- Foreign key relationships for data integrity
- Composite unique keys for idempotency
- Optimized indexes for query performance
- Automatic timestamp tracking
- Support for multiple providers

---

## 🔐 Security Implementation

### 1. Signature Verification

**Request Signature (Outgoing to Provider):**
```php
string_to_sign = method + url + timestamp + body
signature = HMAC_SHA256(string_to_sign, api_secret)
```

**Webhook Signature (Incoming from Provider):**
```php
expected_signature = HMAC_SHA256(request_body, webhook_secret)
verified = hash_equals(expected_signature, received_signature)
```

### 2. Transaction Safety

- Database transactions with `BEGIN/COMMIT/ROLLBACK`
- Row-level locking with `SELECT ... FOR UPDATE`
- Balance validation before deduction
- Atomic operations for consistency

### 3. Idempotency

- Duplicate transaction detection via `provider_txn_id`
- Returns existing result for duplicate requests
- Prevents double-spending and balance corruption

---

## 🔄 API Flow Diagrams

### Game Launch Flow

```
User → Frontend → Backend API → TopProviderAdapter → TOP Provider API
                                                              ↓
User ← Frontend ← Backend API ← game_url + session_id ←──────┘
```

### Bet Callback Flow

```
TOP Provider → Webhook → GamesCallbackController
                              ↓
                    Verify Signature
                              ↓
                    Check Idempotency
                              ↓
                    BEGIN TRANSACTION
                              ↓
                    Lock User Row
                              ↓
                    Check Balance
                              ↓
                    Deduct Amount
                              ↓
                    Log Transaction
                              ↓
                    Create/Update Round
                              ↓
                    COMMIT
                              ↓
                    Return Success + Balance
```

### Win Callback Flow

```
TOP Provider → Webhook → GamesCallbackController
                              ↓
                    Verify Signature
                              ↓
                    Check Idempotency
                              ↓
                    BEGIN TRANSACTION
                              ↓
                    Lock Round & User
                              ↓
                    Check Round Status
                              ↓
                    Add Win Amount
                              ↓
                    Log Transaction
                              ↓
                    Settle Round
                              ↓
                    Log Big Win (if applicable)
                              ↓
                    COMMIT
                              ↓
                    Return Success + Balance
```

---

## 📊 Key Methods Reference

### TopProviderAdapter

| Method | Purpose | Returns |
|--------|---------|---------|
| `getGameList()` | Fetch games from provider | `array` |
| `syncGames()` | Sync games to database | `array` (stats) |
| `launchGame($userId, $gameCode)` | Launch game session | `array` (launch_url, session_id) |
| `verifyWebhookSignature($sig, $body)` | Verify callback authenticity | `bool` |

### GamesCallbackController

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `bet()` | `/api/games/callback/bet` | Process bet and deduct balance |
| `result()` | `/api/games/callback/result` | Process win and add balance |
| `refund()` | `/api/games/callback/refund` | Process refund and restore balance |
| `balance()` | `/api/games/callback/balance` | Return current user balance |

---

## 🧪 Testing Checklist

### Pre-Testing Setup

- [ ] Run database schema: `mysql -u by -p by < boyue/scripts/top_provider_schema.sql`
- [ ] Update `.env` with actual API credentials from Provider Admin
- [ ] Update `TOP_PROVIDER_API_SECRET` with actual secret
- [ ] Update `TOP_PROVIDER_WEBHOOK_SECRET` with actual webhook secret
- [ ] Configure callback URLs in TOP Provider Admin panel
- [ ] Restart Webman server: `php start.php restart`

### Manual Testing Steps

1. **Provider Configuration Test**
   ```bash
   # Check provider record in database
   mysql -u by -p by -e "SELECT * FROM game_providers WHERE code='TOP';"
   ```

2. **Game Sync Test**
   ```php
   // Create test script: boyue/test_top_sync.php
   require_once __DIR__ . '/vendor/autoload.php';
   $adapter = new \app\service\games\TopProviderAdapter();
   $result = $adapter->syncGames();
   print_r($result);
   ```

3. **Game Launch Test**
   - Login to frontend
   - Navigate to Games section
   - Click on a TOP Provider game
   - Verify game launches in new window/iframe

4. **Callback Tests**
   - Monitor logs: `tail -f boyue/runtime/logs/webman.log`
   - Place test bet in game
   - Verify bet callback received and balance deducted
   - Complete game round
   - Verify result callback received and win added
   - Check transaction logs in database

### Database Verification Queries

```sql
-- Check game sync
SELECT COUNT(*) as total_games FROM games WHERE provider_id = (
    SELECT id FROM game_providers WHERE code='TOP'
);

-- Check recent transactions
SELECT * FROM game_transactions 
WHERE provider_id = (SELECT id FROM game_providers WHERE code='TOP')
ORDER BY created_at DESC LIMIT 10;

-- Check active rounds
SELECT * FROM game_rounds 
WHERE status = 'active' 
AND provider_id = (SELECT id FROM game_providers WHERE code='TOP');

-- Check user balance changes
SELECT user_id, transaction_type, amount, balance_before, balance_after, created_at
FROM game_transactions
WHERE user_id = YOUR_TEST_USER_ID
ORDER BY created_at DESC LIMIT 20;
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Signature Verification Failed

**Symptoms:** Callbacks return 401 Unauthorized

**Solutions:**
- Verify `TOP_PROVIDER_WEBHOOK_SECRET` matches Provider Admin setting
- Check webhook signature algorithm (HMAC-SHA256)
- Ensure request body is not modified before verification

### Issue 2: Insufficient Balance

**Symptoms:** Bet callback returns 400 error

**Solutions:**
- Check user balance in database
- Verify balance calculation logic
- Ensure no concurrent transactions

### Issue 3: Duplicate Transaction

**Symptoms:** Same transaction processed twice

**Solutions:**
- Verify idempotency check is working
- Check `provider_txn_id` uniqueness
- Review database transaction isolation level

### Issue 4: Game Launch Failed

**Symptoms:** Launch returns error or empty URL

**Solutions:**
- Verify API credentials in `.env`
- Check Provider API status
- Review request signature generation
- Check game_code exists in provider

---

## 📝 Maintenance Notes

### Regular Tasks

1. **Monitor Logs**
   - Check `boyue/runtime/logs/webman.log` daily
   - Look for callback errors or signature failures

2. **Database Cleanup**
   - Archive old game_transactions (>90 days)
   - Clean expired game_sessions

3. **Game Sync**
   - Run game sync weekly to get new games
   - Update game metadata (RTP, volatility)

### Performance Optimization

1. **Redis Caching**
   - Cache game list for 1 hour
   - Cache provider config for 24 hours

2. **Database Indexes**
   - Monitor slow queries
   - Add indexes as needed for common queries

---

## 📚 Reference Documentation

### Provider Documentation (Password: `1234567811`)

- API Documentation: https://samyarieiv636.github.io/topapidoc.github.io/
- RTP Operations: https://samyarieiv636.github.io/toprtpdoc.github.io/
- Call Functions: https://samyarieiv636.github.io/topcalldoc.github.io/
- Backend Guide: https://samyarieiv636.github.io/topbackenddoc.github.io/

### Provider Admin Access

- URL: https://admin.dcyqv8f2id.com
- Username: `dj-stg-vndk3`
- Password: `9wMqV4rAccgr4F`

### Internal Documentation

- Integration Guide: `boyue/docs/BOB_IDE_GAME_API_INTEGRATION_GUIDE.md`
- F168 Platform Guide: `boyue/docs/F168_GAMING_PLATFORM_GUIDE.md`

---

## ✅ Next Steps

1. **Immediate Actions**
   - [ ] Obtain actual API Secret from Provider Admin Profile
   - [ ] Obtain actual Webhook Secret from Provider Admin
   - [ ] Update `.env` with real credentials
   - [ ] Run database schema SQL file
   - [ ] Configure callback URLs in Provider Admin
   - [ ] Test game synchronization
   - [ ] Test game launch flow
   - [ ] Test all callback endpoints

2. **Production Deployment**
   - [ ] Update production `.env` with production credentials
   - [ ] Run database migrations on production
   - [ ] Configure production callback URLs
   - [ ] Enable SSL certificate verification
   - [ ] Set up monitoring and alerting
   - [ ] Create backup procedures

3. **Documentation**
   - [ ] Create user guide for game management
   - [ ] Document troubleshooting procedures
   - [ ] Create runbook for operations team

---

## 👥 Support Contacts

**Development Team:** Bob IDE AI Assistant  
**Platform:** BOYUE (boyue.okwink6.com)  
**Provider:** TOP Game Provider  
**Integration Date:** 2026-06-01

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-01  
**Status:** ✅ Implementation Complete - Ready for Testing