# 🎮 BOYUE Platform - Game Integration System

A comprehensive lottery and gaming platform with integrated third-party game providers, featuring TOP Provider and F168 Gaming Platform integrations.

## 📋 Table of Contents

- [Overview](#overview)
- [Completed Integrations](#completed-integrations)
- [Core Components](#core-components)
- [Security Features](#security-features)
- [Quick Deployment Guide](#quick-deployment-guide)
- [Callback URLs](#callback-urls)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [Support & Documentation](#support--documentation)

## 🎮 Overview

BOYUE Platform is a full-featured lottery and gaming system built on Webman framework, providing:

- **Multi-Provider Game Integration** - Seamless integration with TOP Provider and F168 Gaming Platform
- **Real-time Gaming** - WebSocket-based live updates and notifications
- **Secure Transactions** - JWT authentication, encrypted communications, and comprehensive audit logging
- **Responsive Design** - Vue.js-based mobile-first frontend
- **Admin Dashboard** - Complete management interface for operations and monitoring

## 🏆 Completed Integrations

### TOP Game Provider ✅
**Status:** Production Ready  
**Documentation:** [`boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md`](boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md)

**Features:**
- Seamless game launch with automatic balance transfer
- Real-time balance synchronization
- Comprehensive callback handling (bet, win, refund, rollback)
- Transaction logging and audit trail
- Error handling and retry mechanisms

**Key Files:**
- Adapter: [`boyue/app/service/games/TopProviderAdapter.php`](boyue/app/service/games/TopProviderAdapter.php)
- Controller: [`boyue/app/controller/api/GamesController.php`](boyue/app/controller/api/GamesController.php)
- Callbacks: [`boyue/app/controller/api/GamesCallbackController.php`](boyue/app/controller/api/GamesCallbackController.php)
- Routes: [`boyue/config/route.php`](boyue/config/route.php)
- Schema: [`boyue/scripts/top_provider_schema.sql`](boyue/scripts/top_provider_schema.sql)

### F168 Gaming Platform ✅
**Status:** Production Ready  
**Documentation:** [`boyue/docs/F168_IMPLEMENTATION_SUMMARY.md`](boyue/docs/F168_IMPLEMENTATION_SUMMARY.md)

**Features:**
- Multi-game type support (Slots, Live Casino, Sports, Fishing, Chess)
- Real-time win notifications with marquee display
- Game categorization and filtering
- Responsive game cards with provider branding
- Integrated balance management

**Key Files:**
- Frontend API: [`wap/src/api/games.js`](wap/src/api/games.js)
- Game Card: [`wap/src/components/games/GameCard.vue`](wap/src/components/games/GameCard.vue)
- Win Ticker: [`wap/src/components/games/WinTicker.vue`](wap/src/components/games/WinTicker.vue)
- Marquee: [`wap/src/components/games/MarqueeNotice.vue`](wap/src/components/games/MarqueeNotice.vue)
- Home View: [`wap/src/views/games/GamesHome.vue`](wap/src/views/games/GamesHome.vue)
- Styles: [`wap/src/assets/styles/f168-gaming.css`](wap/src/assets/styles/f168-gaming.css)
- Router: [`wap/src/router/modules/game.js`](wap/src/router/modules/game.js)
- Schema: [`boyue/scripts/f168_gaming_platform_schema.sql`](boyue/scripts/f168_gaming_platform_schema.sql)

## 📦 Core Components

### Backend (PHP/Webman)

**Game Services:**
- [`boyue/app/service/games/TopProviderAdapter.php`](boyue/app/service/games/TopProviderAdapter.php) - TOP Provider integration
- [`boyue/app/controller/api/GamesController.php`](boyue/app/controller/api/GamesController.php) - Game launch and management
- [`boyue/app/controller/api/GamesCallbackController.php`](boyue/app/controller/api/GamesCallbackController.php) - Provider callbacks

**Configuration:**
- [`boyue/config/route.php`](boyue/config/route.php) - API routing
- [`boyue/config/database.php`](boyue/config/database.php) - Database configuration
- [`boyue/.env`](boyue/.env) - Environment variables

**Database:**
- [`boyue/scripts/top_provider_schema.sql`](boyue/scripts/top_provider_schema.sql) - TOP Provider tables
- [`boyue/scripts/f168_gaming_platform_schema.sql`](boyue/scripts/f168_gaming_platform_schema.sql) - F168 tables

### Frontend (Vue.js)

**Game Components:**
- [`wap/src/components/games/GameCard.vue`](wap/src/components/games/GameCard.vue) - Individual game display
- [`wap/src/components/games/WinTicker.vue`](wap/src/components/games/WinTicker.vue) - Real-time win notifications
- [`wap/src/components/games/MarqueeNotice.vue`](wap/src/components/games/MarqueeNotice.vue) - Scrolling announcements

**Views:**
- [`wap/src/views/games/GamesHome.vue`](wap/src/views/games/GamesHome.vue) - Main games interface

**API Layer:**
- [`wap/src/api/games.js`](wap/src/api/games.js) - Game API client

**Routing:**
- [`wap/src/router/modules/game.js`](wap/src/router/modules/game.js) - Game routes
- [`wap/src/main.js`](wap/src/main.js) - Application entry point

**Styling:**
- [`wap/src/assets/styles/f168-gaming.css`](wap/src/assets/styles/f168-gaming.css) - Game-specific styles

### Admin Dashboard (Vue.js/TypeScript)

**Location:** `ht/` directory  
**Build:** [`ht/deploy.sh`](ht/deploy.sh)

## 🔐 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Session management with Redis
- IP whitelisting for callbacks

### Data Protection
- MD5 signature verification for all provider callbacks
- Encrypted sensitive data storage
- SQL injection prevention via prepared statements
- XSS protection on all inputs

### Transaction Security
- Idempotent transaction processing
- Duplicate transaction detection
- Automatic rollback on failures
- Comprehensive audit logging

### API Security
- Rate limiting on all endpoints
- CORS configuration
- Request validation and sanitization
- Secure callback URL verification

## 🚀 Quick Deployment Guide

### Prerequisites
```bash
# Required Software
- PHP 8.1+
- MySQL 8.0+
- Redis 6.0+
- Nginx 1.18+
- Node.js 16+ (for frontend)
- Composer 2.0+
```

### Backend Setup

1. **Clone and Install Dependencies**
```bash
cd boyue
composer install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
nano .env
```

3. **Database Setup**
```bash
# Import schemas
mysql -u root -p by < scripts/top_provider_schema.sql
mysql -u root -p by < scripts/f168_gaming_platform_schema.sql
```

4. **Start Webman Server**
```bash
php start.php start -d
# Or use the convenience script
./start_webman.sh
```

### Frontend Setup (WAP)

1. **Install Dependencies**
```bash
cd wap
npm install
```

2. **Configure API Endpoint**
```bash
# Edit .env.production
nano .env.production
```

3. **Build and Deploy**
```bash
npm run build
# Deploy dist/ to your web server
./deploy.sh
```

### Admin Dashboard Setup

1. **Install Dependencies**
```bash
cd ht
pnpm install
```

2. **Build and Deploy**
```bash
pnpm run build
# Deploy dist/ to your admin subdomain
./deploy.sh
```

### Nginx Configuration

```nginx
# Main Site
server {
    listen 80;
    server_name boyue.okwink6.com;
    root /home/caipiao/boyue/public;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}

# WAP Frontend
server {
    listen 80;
    server_name wap.boyue.okwink6.com;
    root /home/caipiao/wap/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Admin Dashboard
server {
    listen 80;
    server_name admin.boyue.okwink6.com;
    root /home/caipiao/ht/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📋 Callback URLs

### TOP Provider Callbacks

**Base URL:** `https://boyue.okwink6.com/api/games/callback/top`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/bet` | POST | Process bet transactions |
| `/win` | POST | Process win transactions |
| `/refund` | POST | Process refund transactions |
| `/rollback` | POST | Rollback transactions |

**Callback Format:**
```json
{
  "user_id": "12345",
  "game_id": "slot_001",
  "transaction_id": "TXN123456789",
  "amount": 100.00,
  "currency": "CNY",
  "timestamp": "2026-06-01T00:00:00Z",
  "signature": "md5_hash_here"
}
```

### F168 Gaming Platform Callbacks

**Base URL:** `https://boyue.okwink6.com/api/games/callback/f168`

Similar structure to TOP Provider with additional game type parameters.

## 🛠️ Technology Stack

### Backend
- **Framework:** Webman 1.5+ (High-performance PHP framework)
- **Language:** PHP 8.1+
- **Database:** MySQL 8.0+
- **Cache:** Redis 6.0+
- **WebSocket:** Workerman
- **Authentication:** JWT (Firebase PHP-JWT)

### Frontend (WAP)
- **Framework:** Vue.js 3.x
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **State Management:** Pinia
- **Routing:** Vue Router 4.x
- **UI Components:** Custom + Element Plus

### Admin Dashboard
- **Framework:** Vue.js 3.x + TypeScript
- **Build Tool:** Vite
- **UI Library:** Element Plus
- **Charts:** ECharts
- **Package Manager:** pnpm

### DevOps
- **Web Server:** Nginx 1.18+
- **Process Manager:** Systemd
- **Deployment:** Shell scripts
- **Version Control:** Git

## 📁 Project Structure

```
/home/caipiao/
├── boyue/                          # Backend API (PHP/Webman)
│   ├── app/
│   │   ├── controller/
│   │   │   └── api/
│   │   │       ├── GamesController.php
│   │   │       └── GamesCallbackController.php
│   │   └── service/
│   │       └── games/
│   │           └── TopProviderAdapter.php
│   ├── config/
│   │   ├── route.php
│   │   ├── database.php
│   │   └── redis.php
│   ├── docs/
│   │   ├── TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md
│   │   ├── TOP_PROVIDER_QUICK_START.md
│   │   ├── F168_IMPLEMENTATION_SUMMARY.md
│   │   ├── F168_GAMING_PLATFORM_GUIDE.md
│   │   └── BOB_IDE_GAME_API_INTEGRATION_GUIDE.md
│   ├── scripts/
│   │   ├── top_provider_schema.sql
│   │   └── f168_gaming_platform_schema.sql
│   ├── .env
│   └── start.php
│
├── wap/                            # Mobile Frontend (Vue.js)
│   ├── src/
│   │   ├── api/
│   │   │   └── games.js
│   │   ├── components/
│   │   │   └── games/
│   │   │       ├── GameCard.vue
│   │   │       ├── WinTicker.vue
│   │   │       └── MarqueeNotice.vue
│   │   ├── views/
│   │   │   └── games/
│   │   │       └── GamesHome.vue
│   │   ├── router/
│   │   │   └── modules/
│   │   │       └── game.js
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── f168-gaming.css
│   │   └── main.js
│   └── deploy.sh
│
├── ht/                             # Admin Dashboard (Vue.js + TypeScript)
│   ├── src/
│   │   ├── router/
│   │   ├── views/
│   │   └── config/
│   └── deploy.sh
│
└── README.md                       # This file
```

## 🔧 Environment Configuration

### Backend (.env)

```bash
# Application
APP_DEBUG=false
APP_ENV=production

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=boyue_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# TOP Provider
TOP_PROVIDER_API_URL=https://api.topprovider.com
TOP_PROVIDER_MERCHANT_ID=your_merchant_id
TOP_PROVIDER_SECRET_KEY=your_secret_key
TOP_PROVIDER_CALLBACK_URL=https://boyue.okwink6.com/api/games/callback/top

# F168 Gaming
F168_API_URL=https://api.f168gaming.com
F168_AGENT_ID=your_agent_id
F168_API_KEY=your_api_key
F168_CALLBACK_URL=https://boyue.okwink6.com/api/games/callback/f168

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7200

# WebSocket
WEBSOCKET_PORT=8282
WEBSOCKET_HOST=0.0.0.0
```

### Frontend (.env.production)

```bash
# API Configuration
VITE_API_BASE_URL=https://boyue.okwink6.com/api
VITE_WS_URL=wss://boyue.okwink6.com:8282

# Application
VITE_APP_TITLE=BOYUE Gaming Platform
VITE_APP_ENV=production
```

## 📊 Database Schema

### TOP Provider Tables

**game_providers**
- `id` - Primary key
- `name` - Provider name
- `code` - Unique provider code
- `api_url` - API endpoint
- `status` - Active/Inactive
- `config` - JSON configuration

**game_sessions**
- `id` - Primary key
- `user_id` - User reference
- `provider_id` - Provider reference
- `game_id` - Game identifier
- `session_token` - Unique session token
- `balance_before` - Starting balance
- `balance_after` - Ending balance
- `status` - Session status
- `created_at` - Session start time
- `ended_at` - Session end time

**game_transactions**
- `id` - Primary key
- `session_id` - Session reference
- `user_id` - User reference
- `transaction_id` - Unique transaction ID
- `type` - bet/win/refund/rollback
- `amount` - Transaction amount
- `balance_before` - Balance before transaction
- `balance_after` - Balance after transaction
- `status` - Transaction status
- `provider_data` - JSON provider response
- `created_at` - Transaction timestamp

### F168 Gaming Tables

**f168_games**
- `id` - Primary key
- `game_code` - Unique game code
- `game_name` - Display name
- `game_type` - Category (slots/live/sports/fishing/chess)
- `provider` - Game provider
- `thumbnail` - Image URL
- `status` - Active/Inactive
- `sort_order` - Display order

**f168_game_sessions**
- Similar structure to TOP Provider sessions

**f168_game_transactions**
- Similar structure to TOP Provider transactions

## 📈 API Endpoints

### Game Management

```
POST   /api/games/launch              # Launch game session
GET    /api/games/list                # Get available games
GET    /api/games/categories          # Get game categories
GET    /api/games/balance             # Get user balance
POST   /api/games/transfer            # Transfer balance
```

### TOP Provider Callbacks

```
POST   /api/games/callback/top/bet       # Process bet
POST   /api/games/callback/top/win       # Process win
POST   /api/games/callback/top/refund    # Process refund
POST   /api/games/callback/top/rollback  # Rollback transaction
```

### F168 Gaming Callbacks

```
POST   /api/games/callback/f168/bet      # Process bet
POST   /api/games/callback/f168/win      # Process win
POST   /api/games/callback/f168/refund   # Process refund
```

### User Management

```
POST   /api/auth/login                # User login
POST   /api/auth/logout               # User logout
GET    /api/user/profile              # Get user profile
POST   /api/user/update               # Update profile
```

## 🧪 Testing Checklist

### Backend Testing

- [ ] **Database Connection**
  ```bash
  php -r "require 'vendor/autoload.php'; \$db = new \support\Db(); var_dump(\$db->connection());"
  ```

- [ ] **Redis Connection**
  ```bash
  php -r "require 'vendor/autoload.php'; \$redis = \support\Redis::connection(); var_dump(\$redis->ping());"
  ```

- [ ] **Game Launch Flow**
  - Test user authentication
  - Verify balance transfer
  - Confirm session creation
  - Check game URL generation

- [ ] **Callback Processing**
  - Test bet callback with valid signature
  - Test win callback with valid signature
  - Test refund callback
  - Test rollback callback
  - Verify duplicate transaction handling

- [ ] **Error Handling**
  - Test insufficient balance
  - Test invalid signature
  - Test network timeout
  - Test database failure recovery

### Frontend Testing

- [ ] **Game Display**
  - Verify game cards render correctly
  - Test game filtering by category
  - Check responsive design on mobile
  - Validate game images load properly

- [ ] **User Interactions**
  - Test game launch button
  - Verify balance display updates
  - Check win notifications appear
  - Test marquee scrolling

- [ ] **API Integration**
  - Verify API calls succeed
  - Test error message display
  - Check loading states
  - Validate token refresh

### Integration Testing

- [ ] **End-to-End Flow**
  1. User logs in
  2. Views game list
  3. Launches game
  4. Places bet
  5. Receives win
  6. Balance updates correctly

- [ ] **Cross-Browser Testing**
  - Chrome/Edge
  - Firefox
  - Safari (iOS)
  - Mobile browsers

## 🐛 Troubleshooting

### Common Issues

**Issue: Game won't launch**
```
Solution:
1. Check user balance is sufficient
2. Verify provider API credentials in .env
3. Check game_sessions table for existing session
4. Review logs: tail -f boyue/runtime/logs/webman.log
```

**Issue: Callbacks failing**
```
Solution:
1. Verify callback URL is accessible from provider
2. Check signature validation in GamesCallbackController.php
3. Ensure database transactions are not locked
4. Review callback logs in game_transactions table
```

**Issue: Balance not updating**
```
Solution:
1. Check Redis connection
2. Verify database transaction commits
3. Review balance calculation in TopProviderAdapter.php
4. Check for concurrent transaction conflicts
```

**Issue: Frontend not connecting to API**
```
Solution:
1. Verify VITE_API_BASE_URL in .env.production
2. Check CORS configuration in boyue/config/cors.php
3. Ensure Nginx proxy settings are correct
4. Review browser console for errors
```

### Log Locations

```bash
# Backend Logs
boyue/runtime/logs/webman.log          # Application logs
boyue/runtime/logs/error.log           # Error logs

# Nginx Logs
/var/log/nginx/boyue.access.log        # Access logs
/var/log/nginx/boyue.error.log         # Error logs

# PHP-FPM Logs
/var/log/php8.1-fpm.log                # PHP-FPM logs
```

### Debug Mode

Enable debug mode for detailed error messages:

```bash
# Edit .env
APP_DEBUG=true

# Restart Webman
php start.php restart
```

**⚠️ Warning:** Never enable debug mode in production!

## 📞 Support & Documentation

### Documentation Links

- **TOP Provider Integration:** [`boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md`](boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md)
- **TOP Provider Quick Start:** [`boyue/docs/TOP_PROVIDER_QUICK_START.md`](boyue/docs/TOP_PROVIDER_QUICK_START.md)
- **F168 Gaming Guide:** [`boyue/docs/F168_GAMING_PLATFORM_GUIDE.md`](boyue/docs/F168_GAMING_PLATFORM_GUIDE.md)
- **F168 Implementation:** [`boyue/docs/F168_IMPLEMENTATION_SUMMARY.md`](boyue/docs/F168_IMPLEMENTATION_SUMMARY.md)
- **Bob IDE Integration Guide:** [`boyue/docs/BOB_IDE_GAME_API_INTEGRATION_GUIDE.md`](boyue/docs/BOB_IDE_GAME_API_INTEGRATION_GUIDE.md)
- **Troubleshooting Guide:** [`boyue/TROUBLESHOOTING.md`](boyue/TROUBLESHOOTING.md)

### External Resources

- **Webman Framework:** https://www.workerman.net/doc/webman/
- **Vue.js Documentation:** https://vuejs.org/guide/
- **Element Plus:** https://element-plus.org/
- **Workerman:** https://www.workerman.net/

### Development Team

For technical support or questions:
- Review existing documentation in `boyue/docs/`
- Check troubleshooting guide
- Review code comments in key files
- Consult framework documentation

---

## 📝 License

This project is proprietary software. All rights reserved.

## 🎯 Version

**Current Version:** 1.0.0  
**Last Updated:** 2026-06-01  
**Status:** Production Ready

---

**Built with ❤️ for BOYUE Platform**
