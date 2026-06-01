# BOYUE Platform - Game Provider Integrations

## 🎮 Overview

BOYUE Platform is a comprehensive gaming platform with seamless wallet integration for multiple game providers. This repository contains complete implementations for various gaming providers with production-ready code.

---

## 🏆 Completed Integrations

### 1. TOP Game Provider Integration ✅

**Status:** Production Ready  
**Implementation Date:** June 2026  
**Integration Type:** Seamless Wallet

#### 📦 Core Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| Database Schema | [`boyue/scripts/top_provider_schema.sql`](boyue/scripts/top_provider_schema.sql) | 5 tables: providers, games, sessions, transactions, rounds |
| API Adapter | [`boyue/app/service/games/TopProviderAdapter.php`](boyue/app/service/games/TopProviderAdapter.php) | HMAC-SHA256 signatures, game sync, launch |
| Callback Controller | [`boyue/app/controller/api/GamesCallbackController.php`](boyue/app/controller/api/GamesCallbackController.php) | Bet/Win/Refund/Balance endpoints |
| Routes | [`boyue/config/route.php`](boyue/config/route.php) | 4 callback endpoints configured |
| Game Controller | [`boyue/app/controller/api/GamesController.php`](boyue/app/controller/api/GamesController.php) | TOP Provider detection & launch |

#### 🔐 Security Features

- ✅ HMAC-SHA256 signature generation & verification
- ✅ Database transaction locking (`SELECT FOR UPDATE`)
- ✅ Idempotency checks preventing duplicate processing
- ✅ Comprehensive error logging & monitoring
- ✅ Request/Response validation

#### 🚀 Quick Deployment

```bash
# 1. Install database schema
mysql -u root -p by < boyue/scripts/top_provider_schema.sql

# 2. Configure environment variables
# Edit boyue/.env with actual credentials from Provider Admin

# 3. Restart Webman server
cd boyue
php start.php restart
```

#### 📋 Callback URLs

Configure these URLs in TOP Provider Admin Panel:

```
Bet:     https://boyue.okwink6.com/api/games/callback/bet
Result:  https://boyue.okwink6.com/api/games/callback/result
Refund:  https://boyue.okwink6.com/api/games/callback/refund
Balance: https://boyue.okwink6.com/api/games/callback/balance
```

#### 📚 Documentation

- **[Implementation Summary](boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md)** - Complete technical documentation
- **[Quick Start Guide](boyue/docs/TOP_PROVIDER_QUICK_START.md)** - 5-minute deployment guide

---

### 2. F168 Gaming Platform Integration ✅

**Status:** Production Ready  
**Implementation Date:** May 2026  
**Integration Type:** Full Platform

#### 📦 Core Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| Database Schema | [`boyue/scripts/f168_gaming_platform_schema.sql`](boyue/scripts/f168_gaming_platform_schema.sql) | Complete gaming platform tables |
| Frontend Components | [`wap/src/components/games/`](wap/src/components/games/) | Vue.js game cards, ticker, marquee |
| API Integration | [`wap/src/api/games.js`](wap/src/api/games.js) | Game API endpoints |
| Styling | [`wap/src/assets/styles/f168-gaming.css`](wap/src/assets/styles/f168-gaming.css) | F168 theme styles |

#### 📚 Documentation

- **[Implementation Summary](boyue/docs/F168_IMPLEMENTATION_SUMMARY.md)** - Complete technical documentation
- **[Platform Guide](boyue/docs/F168_GAMING_PLATFORM_GUIDE.md)** - Integration guide

---

## 🛠️ Technology Stack

### Backend
- **Framework:** PHP Webman
- **Database:** MySQL 8.0+
- **Cache:** Redis
- **Security:** HMAC-SHA256, JWT

### Frontend
- **Framework:** Vue.js 3
- **Build Tool:** Vite
- **Styling:** CSS3, Responsive Design
- **State Management:** Pinia

---

## 📁 Project Structure

```
caipiao/
├── boyue/                          # Backend (PHP Webman)
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
│   │   └── database.php
│   ├── docs/                       # Documentation
│   │   ├── TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md
│   │   ├── TOP_PROVIDER_QUICK_START.md
│   │   ├── F168_IMPLEMENTATION_SUMMARY.md
│   │   └── BOB_IDE_GAME_API_INTEGRATION_GUIDE.md
│   ├── scripts/                    # Database schemas & utilities
│   │   ├── top_provider_schema.sql
│   │   └── f168_gaming_platform_schema.sql
│   └── .env                        # Environment configuration
│
├── wap/                            # Frontend (Vue.js)
│   ├── src/
│   │   ├── components/
│   │   │   └── games/
│   │   ├── views/
│   │   │   └── games/
│   │   ├── api/
│   │   └── router/
│   └── deploy.sh
│
└── README.md                       # This file
```

---

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# TOP Game Provider
TOP_PROVIDER_API_URL=https://api.topprovider.com
TOP_PROVIDER_AGENT_ID=your_agent_id
TOP_PROVIDER_API_SECRET=your_api_secret
TOP_PROVIDER_CALLBACK_URL=https://boyue.okwink6.com/api/games/callback

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=by
DB_USERNAME=root
DB_PASSWORD=your_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## 🚦 Getting Started

### Prerequisites

- PHP 8.0+
- MySQL 8.0+
- Redis 6.0+
- Node.js 16+ (for frontend)
- Composer
- Git

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd caipiao

# 2. Install backend dependencies
cd boyue
composer install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Install database schemas
mysql -u root -p by < scripts/top_provider_schema.sql
mysql -u root -p by < scripts/f168_gaming_platform_schema.sql

# 5. Start backend server
php start.php start

# 6. Install frontend dependencies (optional)
cd ../wap
npm install
npm run dev
```

---

## 📊 Database Schema

### TOP Provider Tables

1. **`top_game_providers`** - Provider configuration
2. **`top_games`** - Game catalog
3. **`top_game_sessions`** - Active player sessions
4. **`top_game_transactions`** - Bet/Win/Refund records
5. **`top_game_rounds`** - Game round tracking

### Key Features

- ✅ Transaction safety with row-level locking
- ✅ Idempotency with unique transaction IDs
- ✅ Comprehensive audit trail
- ✅ Optimized indexes for performance

---

## 🔒 Security Best Practices

### Implemented Security Measures

1. **Authentication**
   - HMAC-SHA256 signature verification
   - API secret key management
   - Request timestamp validation

2. **Data Integrity**
   - Database transaction locking
   - Idempotency checks
   - Input validation & sanitization

3. **Error Handling**
   - Comprehensive logging
   - Graceful error responses
   - No sensitive data exposure

4. **Monitoring**
   - Transaction logging
   - Error tracking
   - Performance metrics

---

## 📈 API Endpoints

### TOP Provider Callbacks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/games/callback/bet` | POST | Process bet transactions |
| `/api/games/callback/result` | POST | Process win/loss results |
| `/api/games/callback/refund` | POST | Process refund transactions |
| `/api/games/callback/balance` | POST | Query player balance |

### Game Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/games/list` | GET | List available games |
| `/api/games/launch` | POST | Launch game session |
| `/api/games/sync` | POST | Sync game catalog |

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Database schema installation
- [ ] Environment configuration
- [ ] Game list retrieval
- [ ] Game launch flow
- [ ] Bet transaction processing
- [ ] Win transaction processing
- [ ] Refund transaction processing
- [ ] Balance query
- [ ] Signature verification
- [ ] Error handling

### Test Credentials

Configure test credentials in `.env` file from Provider Admin Panel.

---

## 📝 Development Guidelines

### Code Standards

- Follow PSR-12 coding standards
- Use type hints for PHP 8.0+
- Implement proper error handling
- Write comprehensive comments
- Use meaningful variable names

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-provider-integration

# Commit changes
git add .
git commit -m "feat: Add new provider integration"

# Push to remote
git push origin feature/new-provider-integration
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Signature Verification Failed

**Solution:** Verify API secret in `.env` matches Provider Admin Panel

```bash
# Check current secret
grep TOP_PROVIDER_API_SECRET boyue/.env

# Update if needed
nano boyue/.env
```

#### 2. Database Connection Error

**Solution:** Verify database credentials and connection

```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1"

# Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'by'"
```

#### 3. Callback URL Not Accessible

**Solution:** Verify nginx configuration and firewall rules

```bash
# Test callback URL
curl -X POST https://boyue.okwink6.com/api/games/callback/balance

# Check nginx status
sudo systemctl status nginx
```

---

## 📞 Support

### Documentation

- [TOP Provider Implementation Summary](boyue/docs/TOP_PROVIDER_IMPLEMENTATION_SUMMARY.md)
- [TOP Provider Quick Start](boyue/docs/TOP_PROVIDER_QUICK_START.md)
- [F168 Implementation Summary](boyue/docs/F168_IMPLEMENTATION_SUMMARY.md)
- [Bob IDE Integration Guide](boyue/docs/BOB_IDE_GAME_API_INTEGRATION_GUIDE.md)

### Contact

For technical support or questions, please refer to the documentation files or contact the development team.

---

## 📜 License

This project is proprietary software. All rights reserved.

---

## 🎯 Roadmap

### Completed ✅

- [x] TOP Game Provider seamless wallet integration
- [x] F168 Gaming Platform integration
- [x] Database schema design
- [x] Security implementation (HMAC-SHA256)
- [x] Comprehensive documentation

### Planned 🚧

- [ ] Additional game provider integrations
- [ ] Enhanced monitoring dashboard
- [ ] Automated testing suite
- [ ] Performance optimization
- [ ] Multi-language support

---

## 🙏 Acknowledgments

- PHP Webman Framework
- Vue.js Community
- TOP Game Provider
- F168 Gaming Platform

---

**Last Updated:** June 1, 2026  
**Version:** 1.0.0  
**Status:** Production Ready 🚀
