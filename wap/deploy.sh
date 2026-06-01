#!/bin/bash

###############################################################################
# WAP (Mobile Frontend) Deployment Script
# Purpose: Build and deploy wap project to boyue/public/mobile
# Usage: ./deploy.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
PROJECT_DIR="/var/app/bonwinfull/okwink6/wap"
DEPLOY_DIR="/var/app/bonwinfull/okwink6/boyue/public/mobile"

echo "=========================================="
echo "WAP (MOBILE) DEPLOYMENT SCRIPT"
echo "=========================================="

# Step 1: Verify project directory
echo -e "\n${BLUE}Step 1: Verifying project directory...${NC}"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}✗ Project directory not found: $PROJECT_DIR${NC}"
    exit 1
fi
cd "$PROJECT_DIR"
echo -e "${GREEN}✓ Project directory verified${NC}"

# Step 2: Check Node.js and npm
echo -e "\n${BLUE}Step 2: Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Step 3: Install dependencies
echo -e "\n${BLUE}Step 3: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi
echo -e "${GREEN}✓ Dependencies ready${NC}"

# Step 4: Create production environment file
echo -e "\n${BLUE}Step 4: Creating production environment file...${NC}"
cat > "$PROJECT_DIR/.env.production" << 'EOF'
VITE_PROXY_TARGET=https://boyue.okwink6.com
VITE_WS_URL=wss://boyue.okwink6.com/ws
VITE_IM_WS_URL=wss://boyue.okwink6.com/im-ws
EOF
echo -e "${GREEN}✓ Production environment file created${NC}"

# Step 5: Build project
echo -e "\n${BLUE}Step 5: Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 6: Verify build output
echo -e "\n${BLUE}Step 6: Verifying build output...${NC}"
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo -e "${RED}✗ Build output directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build output verified${NC}"

# Step 7: Backup existing deployment
echo -e "\n${BLUE}Step 7: Backing up existing deployment...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR 2>/dev/null)" ]; then
    BACKUP_DIR="/var/app/bonwinfull/okwink6/boyue/public/backup_mobile_$TIMESTAMP"
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
    echo -e "${GREEN}✓ Backup created: $BACKUP_DIR${NC}"
else
    echo -e "${YELLOW}⚠ No existing deployment to backup${NC}"
fi

# Step 8: Deploy to target directory
echo -e "\n${BLUE}Step 8: Deploying to target directory...${NC}"
mkdir -p "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"/*
cp -r "$PROJECT_DIR/dist"/* "$DEPLOY_DIR/"
echo -e "${GREEN}✓ Deployed to: $DEPLOY_DIR${NC}"

# Step 9: Set permissions
echo -e "\n${BLUE}Step 9: Setting permissions...${NC}"
if command -v chown &> /dev/null; then
    chown -R www-data:www-data "$DEPLOY_DIR" 2>/dev/null || chown -R $(whoami):$(whoami) "$DEPLOY_DIR"
    chmod -R 755 "$DEPLOY_DIR"
    echo -e "${GREEN}✓ Permissions set${NC}"
else
    chmod -R 755 "$DEPLOY_DIR"
    echo -e "${YELLOW}⚠ chown not available, only chmod applied${NC}"
fi

# Step 10: Verify deployment
echo -e "\n${BLUE}Step 10: Verifying deployment...${NC}"
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo -e "${GREEN}✓ Deployment verified${NC}"
else
    echo -e "${RED}✗ Deployment verification failed${NC}"
    exit 1
fi

echo -e "\n=========================================="
echo -e "${GREEN}WAP DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "=========================================="
echo -e "Mobile URL: ${BLUE}https://boyue.okwink6.com/mobile/${NC}"
if [ -n "$BACKUP_DIR" ]; then
    echo -e "Backup: ${BLUE}$BACKUP_DIR${NC}"
fi
echo -e "=========================================="

# Made with Bob
