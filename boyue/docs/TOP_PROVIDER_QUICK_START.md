# TOP Provider Integration - Quick Start Guide

## 🚀 Deployment Steps (5 Minutes)

### Step 1: Deploy Database Schema
```bash
# Connect to MySQL and run schema
mysql -u root -p by < boyue/scripts/top_provider_schema.sql

# Verify tables created
mysql -u root -p by -e "SHOW TABLES LIKE 'game_%';"
```

### Step 2: Get API Credentials

1. **Login to Provider Admin:**
   - URL: https://admin.dcyqv8f2id.com
   - Username: `dj-stg-vndk3`
   - Password: `9wMqV4rAccgr4F`

2. **Get API Key & Secret:**
   - Click Profile icon (top right)
   - Copy **API Key** (already in .env: `SQ9AHcmQT7tYTETknmtXzhOwYXuW6GY2`)
   - Copy **API Secret** → Update in `.env`
   - Copy **Webhook Secret** → Update in `.env`

### Step 3: Update Environment Variables

Edit `boyue/.env`:
```env
TOP_PROVIDER_API_SECRET=YOUR_ACTUAL_SECRET_HERE
TOP_PROVIDER_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
```

### Step 4: Configure Callback URLs in Provider Admin

In Provider Admin panel, configure these callback URLs:

| Callback Type | URL |
|--------------|-----|
| Bet | `https://boyue.okwink6.com/api/games/callback/bet` |
| Result | `https://boyue.okwink6.com/api/games/callback/result` |
| Refund | `https://boyue.okwink6.com/api/games/callback/refund` |
| Balance | `https://boyue.okwink6.com/api/games/callback/balance` |

### Step 5: Restart Webman Server

```bash
cd /home/caipiao/boyue
php start.php restart
```

### Step 6: Sync Games

Create test file `boyue/sync_top_games.php`:
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use app\service\games\TopProviderAdapter;

$adapter = new TopProviderAdapter();
$result = $adapter->syncGames();

echo "Game Sync Results:\n";
echo "Total: {$result['total']}\n";
echo "Inserted: {$result['inserted']}\n";
echo "Updated: {$result['updated']}\n";
echo "Errors: {$result['errors']}\n";
```

Run sync:
```bash
php boyue/sync_top_games.php
```

### Step 7: Test Game Launch

1. Login to frontend: https://boyue.okwink6.com
2. Navigate to Games section
3. Click any TOP Provider game
4. Game should launch in new window

### Step 8: Monitor Logs

```bash
# Watch real-time logs
tail -f boyue/runtime/logs/webman.log

# Check for callback activity
grep "Callback Received" boyue/runtime/logs/webman.log
```

## ✅ Verification Checklist

- [ ] Database tables created successfully
- [ ] Provider record exists in `game_providers` table
- [ ] Games synced to `games` table
- [ ] API credentials updated in `.env`
- [ ] Callback URLs configured in Provider Admin
- [ ] Webman server restarted
- [ ] Game launches successfully
- [ ] Bet callback received and logged
- [ ] Balance deducted correctly
- [ ] Win callback received and logged
- [ ] Balance credited correctly

## 🔍 Quick Verification Queries

```sql
-- Check provider configuration
SELECT * FROM game_providers WHERE code='TOP';

-- Check synced games
SELECT COUNT(*) as total_games FROM games 
WHERE provider_id = (SELECT id FROM game_providers WHERE code='TOP');

-- Check recent transactions
SELECT * FROM game_transactions 
WHERE provider_id = (SELECT id FROM game_providers WHERE code='TOP')
ORDER BY created_at DESC LIMIT 5;

-- Check active game sessions
SELECT * FROM game_sessions 
WHERE status='active' 
AND provider_id = (SELECT id FROM game_providers WHERE code='TOP');
```

## 🆘 Troubleshooting

### Issue: Games not syncing
```bash
# Check API connectivity
curl -X GET "https://dcyqv8f2id.com/api/v2/games/list" \
  -H "X-Operator-Id: dj-stg-vndk3" \
  -H "X-API-Key: SQ9AHcmQT7tYTETknmtXzhOwYXuW6GY2"
```

### Issue: Callback signature failed
- Verify `TOP_PROVIDER_WEBHOOK_SECRET` matches Provider Admin
- Check logs for signature mismatch details

### Issue: Balance not updating
- Check database transaction logs
- Verify user has sufficient balance
- Review `game_transactions` table for errors

## 📚 Documentation

- Full Implementation: [`TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md`](TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md)
- Integration Guide: [`BOB_IDE_GAME_API_INTEGRATION_GUIDE.md`](BOB_IDE_GAME_API_INTEGRATION_GUIDE.md)
- Provider API Docs: https://samyarieiv636.github.io/topapidoc.github.io/ (Password: `1234567811`)

---

**Ready to go live!** 🎮