#!/bin/bash

# ============================================
# Setup Assets Script
# Date: 2026-05-22
# Purpose: Create directory structure and placeholder images
# ============================================

set -e  # Exit on error

echo "============================================"
echo "🚀 Starting Assets Setup"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/var/app/bonwinfull/okwink6"
PUBLIC_DIR="$BASE_DIR/public"

echo -e "${BLUE}📁 Creating directory structure...${NC}"

# Create main directories
mkdir -p "$PUBLIC_DIR/siteadmin/upload/img"
mkdir -p "$PUBLIC_DIR/assets/games"
mkdir -p "$PUBLIC_DIR/assets/banners"
mkdir -p "$PUBLIC_DIR/assets/icons"
mkdir -p "$PUBLIC_DIR/uploads/2026/05"

echo -e "${GREEN}✓ Directories created${NC}"

# ============================================
# Create placeholder images
# ============================================

echo -e "${BLUE}🖼️  Creating placeholder images...${NC}"

# Base64 encoded 1x1 transparent PNG
TRANSPARENT_PNG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# List of missing image IDs from console errors
IMAGE_IDS=(
  "1811459665877856258"
  "1811459703577759746"
  "1811459833569263617"
  "1811460073188732930"
  "1811459758972944386"
  "1811459874640568321"
  "1811459945420800002"
  "1811460040663703553"
  "1811459914321080321"
  "1811459796504199169"
)

# Create placeholder images in multiple formats
cd "$PUBLIC_DIR/siteadmin/upload/img"

for img_id in "${IMAGE_IDS[@]}"; do
  # Create .avif file
  echo "$TRANSPARENT_PNG" | base64 -d > "${img_id}.avif" 2>/dev/null || true
  
  # Create .jpg file
  echo "$TRANSPARENT_PNG" | base64 -d > "${img_id}.jpg" 2>/dev/null || true
  
  # Create .png file
  echo "$TRANSPARENT_PNG" | base64 -d > "${img_id}.png" 2>/dev/null || true
  
  echo -e "${GREEN}✓ Created placeholders for ${img_id}${NC}"
done

# ============================================
# Create a better placeholder image using ImageMagick (if available)
# ============================================

if command -v convert &> /dev/null; then
  echo -e "${BLUE}🎨 Creating better placeholder with ImageMagick...${NC}"
  
  for img_id in "${IMAGE_IDS[@]}"; do
    # Create a 200x200 placeholder with text
    convert -size 200x200 xc:lightgray \
      -gravity center \
      -pointsize 20 \
      -fill black \
      -annotate +0+0 "Game\nIcon" \
      "${img_id}.png" 2>/dev/null || true
    
    # Convert to other formats
    convert "${img_id}.png" "${img_id}.jpg" 2>/dev/null || true
    convert "${img_id}.png" "${img_id}.avif" 2>/dev/null || true
  done
  
  echo -e "${GREEN}✓ Enhanced placeholders created${NC}"
else
  echo -e "${YELLOW}⚠ ImageMagick not found, using basic placeholders${NC}"
fi

# ============================================
# Set proper permissions
# ============================================

echo -e "${BLUE}🔒 Setting permissions...${NC}"

cd "$BASE_DIR"
chmod -R 755 public/
chown -R www-data:www-data public/ 2>/dev/null || chown -R www-data:www-data public/ 2>/dev/null || true

echo -e "${GREEN}✓ Permissions set${NC}"

# ============================================
# Verify setup
# ============================================

echo -e "${BLUE}🔍 Verifying setup...${NC}"

echo ""
echo "Directory structure:"
ls -la "$PUBLIC_DIR/siteadmin/upload/img/" | head -15

echo ""
echo "Total placeholder images created:"
find "$PUBLIC_DIR/siteadmin/upload/img/" -type f | wc -l

# ============================================
# Summary
# ============================================

echo ""
echo "============================================"
echo -e "${GREEN}✓✓✓ Assets Setup Completed Successfully ✓✓✓${NC}"
echo "============================================"
echo ""
echo "Created directories:"
echo "  - $PUBLIC_DIR/siteadmin/upload/img"
echo "  - $PUBLIC_DIR/assets/games"
echo "  - $PUBLIC_DIR/assets/banners"
echo "  - $PUBLIC_DIR/assets/icons"
echo ""
echo "Created placeholder images for ${#IMAGE_IDS[@]} game icons"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Run the SQL script: mysql -u root -p by-vi < boyue/scripts/fix_domains.sql"
echo "  2. Restart the backend: cd boyue && php start.php restart"
echo "  3. Clear browser cache and test"
echo ""

# Made with Bob
