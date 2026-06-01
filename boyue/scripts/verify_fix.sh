#!/bin/bash

# ============================================
# Verification Script
# Date: 2026-05-22
# Purpose: Verify that all fixes have been applied correctly
# ============================================

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

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

echo ""
echo "============================================"
echo -e "${CYAN}🔍 Verification Report${NC}"
echo "============================================"
echo ""

# ============================================
# Test 1: Check Database for Old Domains
# ============================================

echo -e "${BLUE}Test 1: Checking database for old domains...${NC}"

if command -v mysql &> /dev/null; then
  echo -e "${YELLOW}Enter MySQL root password:${NC}"
  
  OLD_DOMAINS=$(mysql -u "$DB_USER" -p "$DB_NAME" -se "
    SELECT COUNT(*) FROM (
      SELECT id FROM caipiao_game WHERE icon LIKE '%hwyla8%' OR icon LIKE '%hwdl5%' OR logo LIKE '%hwyla8%' OR logo LIKE '%hwdl5%'
      UNION ALL
      SELECT id FROM caipiao_banner WHERE image LIKE '%hwyla8%' OR image LIKE '%hwdl5%'
      UNION ALL
      SELECT id FROM caipiao_config WHERE value LIKE '%hwyla8%' OR value LIKE '%hwdl5%'
      UNION ALL
      SELECT id FROM gscplus_games WHERE icon_url LIKE '%hwyla8%' OR icon_url LIKE '%hwdl5%' OR banner_url LIKE '%hwyla8%' OR banner_url LIKE '%hwdl5%'
    ) AS combined;
  " 2>/dev/null)
  
  if [ "$OLD_DOMAINS" = "0" ]; then
    echo -e "${GREEN}✓ PASS: No old domains found in database${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${RED}✗ FAIL: Found $OLD_DOMAINS records with old domains${NC}"
    ((FAIL_COUNT++))
  fi
else
  echo -e "${YELLOW}⚠ WARN: mysql command not found${NC}"
  ((WARN_COUNT++))
fi

echo ""

# ============================================
# Test 2: Check Assets Directory Structure
# ============================================

echo -e "${BLUE}Test 2: Checking assets directory structure...${NC}"

REQUIRED_DIRS=(
  "public/siteadmin/upload/img"
  "public/assets/games"
  "public/assets/banners"
  "public/assets/icons"
)

DIR_CHECK_PASS=true

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$BASE_DIR/$dir" ]; then
    echo -e "${GREEN}  ✓ $dir exists${NC}"
  else
    echo -e "${RED}  ✗ $dir missing${NC}"
    DIR_CHECK_PASS=false
  fi
done

if [ "$DIR_CHECK_PASS" = true ]; then
  echo -e "${GREEN}✓ PASS: All required directories exist${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL: Some directories are missing${NC}"
  ((FAIL_COUNT++))
fi

echo ""

# ============================================
# Test 3: Check Placeholder Images
# ============================================

echo -e "${BLUE}Test 3: Checking placeholder images...${NC}"

IMAGE_DIR="$BASE_DIR/public/siteadmin/upload/img"
IMAGE_COUNT=$(find "$IMAGE_DIR" -type f 2>/dev/null | wc -l)

if [ "$IMAGE_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS: Found $IMAGE_COUNT placeholder images${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL: No placeholder images found${NC}"
  ((FAIL_COUNT++))
fi

echo ""

# ============================================
# Test 4: Check Directory Permissions
# ============================================

echo -e "${BLUE}Test 4: Checking directory permissions...${NC}"

PUBLIC_DIR="$BASE_DIR/public"

if [ -d "$PUBLIC_DIR" ]; then
  PERMS=$(stat -c "%a" "$PUBLIC_DIR" 2>/dev/null || stat -f "%A" "$PUBLIC_DIR" 2>/dev/null)
  
  if [ "$PERMS" = "755" ] || [ "$PERMS" = "775" ]; then
    echo -e "${GREEN}✓ PASS: Public directory has correct permissions ($PERMS)${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${YELLOW}⚠ WARN: Public directory permissions are $PERMS (expected 755 or 775)${NC}"
    ((WARN_COUNT++))
  fi
else
  echo -e "${RED}✗ FAIL: Public directory not found${NC}"
  ((FAIL_COUNT++))
fi

echo ""

# ============================================
# Test 5: Check Backend Status
# ============================================

echo -e "${BLUE}Test 5: Checking backend status...${NC}"

if pgrep -f "php.*start.php" > /dev/null; then
  echo -e "${GREEN}✓ PASS: Backend is running${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL: Backend is not running${NC}"
  ((FAIL_COUNT++))
fi

echo ""

# ============================================
# Test 6: Check API Endpoint
# ============================================

echo -e "${BLUE}Test 6: Testing API endpoint...${NC}"

if command -v curl &> /dev/null; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8788/api/v1/auth/heartbeat 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ PASS: API endpoint is responding (HTTP $HTTP_CODE)${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${RED}✗ FAIL: API endpoint returned HTTP $HTTP_CODE${NC}"
    ((FAIL_COUNT++))
  fi
else
  echo -e "${YELLOW}⚠ WARN: curl not found, cannot test API${NC}"
  ((WARN_COUNT++))
fi

echo ""

# ============================================
# Test 7: Check Frontend Configuration
# ============================================

echo -e "${BLUE}Test 7: Checking frontend configuration...${NC}"

CONFIG_CHECK_PASS=true

# Check WAP config
if [ -f "$BASE_DIR/wap/.env.development" ]; then
  if grep -q "VITE_API_BASE_URL=/api/v1" "$BASE_DIR/wap/.env.development"; then
    echo -e "${GREEN}  ✓ WAP API config is correct${NC}"
  else
    echo -e "${RED}  ✗ WAP API config may be incorrect${NC}"
    CONFIG_CHECK_PASS=false
  fi
else
  echo -e "${YELLOW}  ⚠ WAP .env.development not found${NC}"
  CONFIG_CHECK_PASS=false
fi

# Check HT config
if [ -f "$BASE_DIR/ht/.env.development" ]; then
  echo -e "${GREEN}  ✓ HT config file exists${NC}"
else
  echo -e "${YELLOW}  ⚠ HT .env.development not found${NC}"
  CONFIG_CHECK_PASS=false
fi

if [ "$CONFIG_CHECK_PASS" = true ]; then
  echo -e "${GREEN}✓ PASS: Frontend configuration looks good${NC}"
  ((PASS_COUNT++))
else
  echo -e "${YELLOW}⚠ WARN: Some frontend configuration issues detected${NC}"
  ((WARN_COUNT++))
fi

echo ""

# ============================================
# Test 8: Check for Common Issues
# ============================================

echo -e "${BLUE}Test 8: Checking for common issues...${NC}"

ISSUES_FOUND=false

# Check if nginx is running
if command -v nginx &> /dev/null; then
  if pgrep nginx > /dev/null; then
    echo -e "${GREEN}  ✓ Nginx is running${NC}"
  else
    echo -e "${YELLOW}  ⚠ Nginx is not running${NC}"
    ISSUES_FOUND=true
  fi
fi

# Check if port 8788 is listening
if command -v netstat &> /dev/null; then
  if netstat -tuln | grep -q ":8788"; then
    echo -e "${GREEN}  ✓ Port 8788 is listening${NC}"
  else
    echo -e "${RED}  ✗ Port 8788 is not listening${NC}"
    ISSUES_FOUND=true
  fi
elif command -v ss &> /dev/null; then
  if ss -tuln | grep -q ":8788"; then
    echo -e "${GREEN}  ✓ Port 8788 is listening${NC}"
  else
    echo -e "${RED}  ✗ Port 8788 is not listening${NC}"
    ISSUES_FOUND=true
  fi
fi

if [ "$ISSUES_FOUND" = false ]; then
  echo -e "${GREEN}✓ PASS: No common issues detected${NC}"
  ((PASS_COUNT++))
else
  echo -e "${YELLOW}⚠ WARN: Some common issues detected${NC}"
  ((WARN_COUNT++))
fi

echo ""

# ============================================
# Summary
# ============================================

TOTAL_TESTS=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))

echo "============================================"
echo -e "${CYAN}📊 Verification Summary${NC}"
echo "============================================"
echo ""
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo -e "${YELLOW}Warnings: $WARN_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓✓✓ All Critical Tests Passed! ✓✓✓${NC}"
  echo ""
  echo -e "${CYAN}Next Steps:${NC}"
  echo "  1. Clear browser cache (Ctrl+Shift+Delete)"
  echo "  2. Hard reload the page (Ctrl+Shift+R)"
  echo "  3. Open Developer Console (F12)"
  echo "  4. Check Network tab for any remaining errors"
  echo ""
  exit 0
else
  echo -e "${RED}✗✗✗ Some Tests Failed ✗✗✗${NC}"
  echo ""
  echo -e "${YELLOW}Recommended Actions:${NC}"
  echo "  1. Review failed tests above"
  echo "  2. Run fix script again: bash boyue/scripts/fix_all.sh"
  echo "  3. Check logs: tail -f boyue/runtime/logs/webman.log"
  echo "  4. Verify database connection"
  echo ""
  exit 1
fi

# Made with Bob
