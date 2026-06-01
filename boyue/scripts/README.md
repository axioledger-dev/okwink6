# 🔧 Domain & Assets Fix Scripts

Quick reference for fixing domain and assets issues.

## 🚀 Quick Start

```bash
cd /var/app/bonwinfull/okwink6

# Make scripts executable
chmod +x boyue/scripts/*.sh

# Run complete fix (recommended)
bash boyue/scripts/fix_all.sh

# Verify fix
bash boyue/scripts/verify_fix.sh
```

## 📁 Scripts Overview

### 1. `fix_all.sh` - Complete Automated Fix
**Purpose**: One-command solution to fix everything  
**Usage**: `bash boyue/scripts/fix_all.sh`

**What it does**:
- ✅ Backs up database
- ✅ Creates asset directories
- ✅ Generates placeholder images
- ✅ Fixes domains in database
- ✅ Restarts backend
- ✅ Verifies configuration

**Time**: ~5 minutes

---

### 2. `fix_domains.sql` - Database Fix
**Purpose**: Replace dead domains with local paths  
**Usage**: `mysql -u root -p by-vi < boyue/scripts/fix_domains.sql`

**What it does**:
- Backs up affected records
- Replaces `https://web.hwyla8.net` → `/public`
- Replaces `https://www.hwdl5.com` → `/public`
- Updates 4 tables: caipiao_game, caipiao_banner, caipiao_config, gscplus_games

**Time**: ~1 minute

---

### 3. `setup_assets.sh` - Asset Setup
**Purpose**: Create directories and placeholder images  
**Usage**: `bash boyue/scripts/setup_assets.sh`

**What it does**:
- Creates `/public/siteadmin/upload/img/`
- Creates `/public/assets/` structure
- Generates 10 placeholder images (3 formats each)
- Sets proper permissions (755)

**Time**: ~1 minute

---

### 4. `verify_fix.sh` - Verification
**Purpose**: Verify all fixes applied correctly  
**Usage**: `bash boyue/scripts/verify_fix.sh`

**What it checks**:
- ✓ No old domains in database
- ✓ Asset directories exist
- ✓ Placeholder images created
- ✓ Correct permissions
- ✓ Backend running
- ✓ API responding
- ✓ Frontend config correct

**Time**: ~30 seconds

---

## 📋 Step-by-Step (Manual)

If you prefer manual execution:

```bash
# Step 1: Backup
mysqldump -u root -p by-vi > backup_$(date +%Y%m%d_%H%M%S).sql

# Step 2: Setup assets
bash boyue/scripts/setup_assets.sh

# Step 3: Fix database
mysql -u root -p by-vi < boyue/scripts/fix_domains.sql

# Step 4: Restart backend
cd /home/caipiao/boyue
php start.php restart

# Step 5: Verify
cd /var/app/bonwinfull/okwink6
bash boyue/scripts/verify_fix.sh
```

---

## 🔄 Rollback

If something goes wrong:

```bash
# Restore from backup
mysql -u root -p by-vi < backup_YYYYMMDD_HHMMSS.sql

# Or use built-in backup table
mysql -u root -p by-vi -e "SELECT * FROM backup_before_domain_fix_20260522 LIMIT 5;"
```

---

## 📊 Expected Results

### Before Fix
```
❌ ERR_NAME_NOT_RESOLVED for hwyla8.net
❌ ERR_NAME_NOT_RESOLVED for hwdl5.com
❌ 404 errors for placeholder images
❌ Broken game icons
❌ Missing banners
```

### After Fix
```
✅ All domains replaced with /public
✅ Placeholder images created
✅ Assets loading correctly
✅ No console errors
✅ Backend running smoothly
```

---

## 🆘 Troubleshooting

### Script Permission Denied
```bash
chmod +x boyue/scripts/*.sh
```

### Database Connection Failed
```bash
# Test connection
mysql -u root -p by-vi -e "SELECT 1;"

# Check credentials in boyue/.env
cat boyue/.env | grep DB_
```

### Backend Not Starting
```bash
# Check logs
tail -f boyue/runtime/logs/webman.log

# Check port
netstat -tuln | grep 8788

# Kill and restart
pkill -f "php.*start.php"
cd boyue && php start.php start -d
```

### Images Still 404
```bash
# Check directory
ls -la public/siteadmin/upload/img/

# Fix permissions
chmod -R 755 public/
chown -R www-data:www-data public/
```

---

## 📖 Full Documentation

For complete documentation, see: [`DOMAIN_ASSETS_FIX_GUIDE.md`](../../DOMAIN_ASSETS_FIX_GUIDE.md)

---

## ✅ Success Checklist

- [ ] Scripts are executable
- [ ] Database backup created
- [ ] Assets directories created
- [ ] Placeholder images generated
- [ ] Database domains replaced
- [ ] Backend restarted
- [ ] Verification passed
- [ ] Browser cache cleared
- [ ] No console errors
- [ ] Website working correctly

---

**Last Updated**: 2026-05-22  
**Version**: 1.0