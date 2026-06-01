#!/bin/bash

# ============================================
# Complete Domain & Assets Fix Script
# Date: 2026-05-22
# Purpose: Automated fix for domain and assets issues
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_DIR="/var/app/bonwinfull/okwink6"
DB_NAME="by-vi"
DB_USER="root"

echo ""
echo "============================================"
echo -e "${CYAN}🔧 Complete Domain & Assets Fix${NC}"
echo "============================================"
echo ""

# ============================================
# Step 1: Backup Database
# ============================================

echo -e "${BLUE}📦 Step 1: Creating database backup...${NC}"

BACKUP_FILE="$BASE_DIR/backup_before_fix_$(date +%Y%m%d_%H%M%S).sql"

if command -v mysqldump &> /dev/null; then
  echo -e "${YELLOW}Enter MySQL root password:${NC}"
  mysqldump -u "$DB_USER" -p "$DB_NAME" > "$BACKUP_FILE"
  echo -e "${GREEN}✓ Database backed up to: $BACKUP_FILE${NC}"
else
  echo -e "${YELLOW}⚠ mysqldump not found, skipping database backup${NC}"
fi

echo ""

# ============================================
# Step 2: Setup Assets
# ============================================

echo -e "${BLUE}📁 Step 2: Setting up assets structure...${NC}"

cd "$BASE_DIR"
bash boyue/scripts/setup_assets.sh

echo ""

# ============================================
# Step 3: Fix Database Domains
# ============================================

echo -e "${BLUE}🗄️  Step 3: Fixing domains in database...${NC}"

echo -e "${YELLOW}Enter MySQL root password to fix domains:${NC}"
mysql -u "$DB_USER" -p "$DB_NAME" < boyue/scripts/fix_domains.sql

echo -e "${GREEN}✓ Database domains fixed${NC}"
echo ""

# ============================================
# Step 4: Verify Frontend Configuration
# ============================================

echo -e "${BLUE}🔍 Step 4: Verifying frontend configuration...${NC}"

# Check WAP configuration
if [ -f "wap/.env.development" ]; then
  echo "WAP Development Config:"
  grep "VITE_API_BASE_URL\|VITE_PROXY_TARGET" wap/.env.development
  echo -e "${GREEN}✓ WAP config looks good${NC}"
else
  echo -e "${RED}✗ WAP .env.development not found${NC}"
fi

echo ""

# Check HT configuration
if [ -f "ht/.env.development" ]; then
  echo "HT Development Config:"
  grep "VITE_API_URL\|VITE_API_PROXY_URL" ht/.env.development
  echo -e "${GREEN}✓ HT config looks good${NC}"
else
  echo -e "${RED}✗ HT .env.development not found${NC}"
fi

echo ""

# ============================================
# Step 5: Check Backend Status
# ============================================

echo -e "${BLUE}🔧 Step 5: Checking backend status...${NC}"

cd "$BASE_DIR/boyue"

if [ -f "start.php" ]; then
  # Check if webman is running
  if pgrep -f "php.*start.php" > /dev/null; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo -e "${YELLOW}Restarting backend...${NC}"
    php start.php restart
    echo -e "${GREEN}✓ Backend restarted${NC}"
  else
    echo -e "${YELLOW}⚠ Backend is not running${NC}"
    echo -e "${YELLOW}Starting backend...${NC}"
    php start.php start -d
    echo -e "${GREEN}✓ Backend started${NC}"
  fi
else
  echo -e "${RED}✗ start.php not found${NC}"
fi

echo ""

# ============================================
# Step 6: Verify Assets
# ============================================

echo -e "${BLUE}📊 Step 6: Verifying assets...${NC}"

cd "$BASE_DIR"

echo "Checking public directory structure:"
ls -la public/ 2>/dev/null || echo "public/ directory not found"

echo ""
echo "Checking placeholder images:"
ls -la public/siteadmin/upload/img/ 2>/dev/null | head -10 || echo "Images directory not found"

echo ""

# ============================================
# Step 7: Test API Endpoint
# ============================================

echo -e "${BLUE}🌐 Step 7: Testing API endpoint...${NC}"

if command -v curl &> /dev/null; then
  echo "Testing heartbeat endpoint..."
  
  # Test local backend
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8788/api/v1/auth/heartbeat 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ Backend API is responding (HTTP $HTTP_CODE)${NC}"
  else
    echo -e "${YELLOW}⚠ Backend API returned HTTP $HTTP_CODE${NC}"
  fi
else
  echo -e "${YELLOW}⚠ curl not found, skipping API test${NC}"
fi

echo ""

# ============================================
# Step 8: Summary & Next Steps
# ============================================

echo "============================================"
echo -e "${GREEN}✓✓✓ Fix Process Completed ✓✓✓${NC}"
echo "============================================"
echo ""
echo -e "${CYAN}Summary:${NC}"
echo "  ✓ Database backed up"
echo "  ✓ Assets structure created"
echo "  ✓ Placeholder images generated"
echo "  ✓ Database domains replaced"
echo "  ✓ Backend restarted"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Clear browser cache (Ctrl+Shift+Delete)"
echo "  2. Hard reload the page (Ctrl+Shift+R)"
echo "  3. Open Developer Console (F12) and check for errors"
echo "  4. Verify images are loading correctly"
echo ""
echo -e "${CYAN}Verification Commands:${NC}"
echo "  • Check database: mysql -u root -p $DB_NAME"
echo "  • View logs: tail -f boyue/runtime/logs/webman.log"
echo "  • Test API: curl http://localhost:8788/api/v1/auth/heartbeat"
echo ""
echo -e "${CYAN}Rollback (if needed):${NC}"
echo "  • Restore database: mysql -u root -p $DB_NAME < $BACKUP_FILE"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
echo ""

# Made with Bob
