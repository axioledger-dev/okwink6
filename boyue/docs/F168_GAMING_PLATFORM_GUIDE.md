# F168 Gaming Platform - Complete Implementation Guide

## 📋 Overview

This document provides a comprehensive guide for the F168-style gaming platform implementation using **Vue.js 3**, **PHP (Webman)**, **MySQL**, and **CSS**. The system follows clean code principles, mobile-first design, and optimized performance.

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Vue 3 (Composition API) + Vant UI + Vite
- **Backend**: PHP 8+ with Webman Framework
- **Database**: MySQL 8.0+
- **Styling**: SCSS + CSS Variables
- **State Management**: Pinia
- **HTTP Client**: Axios

### Project Structure

```
/home/caipiao/
├── boyue/                          # Backend (PHP/Webman)
│   ├── app/
│   │   └── controller/
│   │       └── api/
│   │           └── GamesController.php
│   ├── config/
│   │   ├── database.php
│   │   └── route.php
│   ├── scripts/
│   │   └── f168_gaming_platform_schema.sql
│   └── docs/
│       └── F168_GAMING_PLATFORM_GUIDE.md
│
└── wap/                            # Frontend (Vue 3)
    ├── src/
    │   ├── api/
    │   │   └── games.js            # API service layer
    │   ├── assets/
    │   │   └── styles/
    │   │       └── f168-gaming.css # Global styles
    │   ├── components/
    │   │   └── games/
    │   │       ├── GameCard.vue
    │   │       ├── MarqueeNotice.vue
    │   │       └── WinTicker.vue
    │   └── views/
    │       └── games/
    │           └── GamesHome.vue
    └── package.json
```

---

## 🗄️ Database Setup

### 1. Create Database

```sql
CREATE DATABASE IF NOT EXISTS `f168_gaming` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `f168_gaming`;
```

### 2. Import Schema

```bash
cd /home/caipiao/boyue
mysql -u root -p by < scripts/f168_gaming_platform_schema.sql
```

### 3. Verify Tables

```sql
SHOW TABLES;

-- Expected tables:
-- users, game_categories, games, user_favorites
-- win_logs, bet_history, transactions, announcements
-- user_sessions
```

### 4. Configure Database Connection

Edit [`boyue/config/database.php`](boyue/config/database.php:10):

```php
'connections' => [
    'mysql' => [
        'driver'      => 'mysql',
        'host'        => '127.0.0.1',
        'port'        => 3306,
        'database'    => 'by',
        'username'    => 'root',
        'password'    => 'Ditconme1@',
        'charset'     => 'utf8mb4',
        'collation'   => 'utf8mb4_unicode_ci',
    ],
],
```

---

## 🔌 Backend API Setup

### 1. Register Routes

Add to [`boyue/config/route.php`](boyue/config/route.php):

```php
<?php
use Webman\Route;
use app\controller\api\GamesController;

// Games API Routes
Route::group('/api/v1', function () {
    // Categories
    Route::get('/categories', [GamesController::class, 'categories']);
    
    // Games
    Route::get('/games', [GamesController::class, 'index']);
    Route::get('/games/{id}', [GamesController::class, 'show']);
    Route::get('/games/hot', [GamesController::class, 'hot']);
    Route::get('/games/search', [GamesController::class, 'search']);
    
    // Game Actions (Requires Authentication)
    Route::post('/games/launch', [GamesController::class, 'launch']);
    Route::post('/games/favorite', [GamesController::class, 'favorite']);
    Route::get('/games/favorites', [GamesController::class, 'favorites']);
    
    // Live Data
    Route::get('/live-winners', [GamesController::class, 'liveWinners']);
    Route::get('/announcements', [GamesController::class, 'announcements']);
});
```

### 2. Test API Endpoints

```bash
# Test categories endpoint
curl http://localhost:8787/api/v1/categories

# Test games endpoint
curl http://localhost:8787/api/v1/games?category=HOT&limit=10

# Test live winners
curl http://localhost:8787/api/v1/live-winners?limit=20
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd /home/caipiao/wap
npm install
```

### 2. Import Global Styles

Add to [`wap/src/main.js`](wap/src/main.js:6):

```javascript
import '@/assets/styles/f168-gaming.css'
```

### 3. Configure API Base URL

Create or update [`wap/src/utils/request.js`](wap/src/utils/request.js):

```javascript
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
request.interceptors.response.use(
  response => {
    const { data } = response
    if (data.code === 0) {
      return data
    }
    return Promise.reject(new Error(data.message || 'Request failed'))
  },
  error => Promise.reject(error)
)

export default request
```

### 4. Add Route

Update [`wap/src/router/index.js`](wap/src/router/index.js):

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import GamesHome from '@/views/games/GamesHome.vue'

const routes = [
  {
    path: '/games',
    name: 'GamesHome',
    component: GamesHome,
    meta: { title: 'Trò Chơi' }
  },
  // ... other routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

## 🎮 Component Usage

### GameCard Component

```vue
<template>
  <GameCard
    :game="gameData"
    :show-favorite="true"
    :show-play-count="true"
    @click="handleGameClick"
    @favorite-toggle="handleFavoriteToggle"
  />
</template>

<script setup>
import GameCard from '@/components/games/GameCard.vue'

const gameData = {
  game_id: 1,
  game_name: 'Fortune Tiger',
  provider: 'PG',
  image_url: '/assets/games/fortune-tiger.jpg',
  is_hot: true,
  is_new: false,
  play_count: 15680
}

const handleGameClick = (game) => {
  console.log('Game clicked:', game)
}

const handleFavoriteToggle = ({ gameId, isFavorite }) => {
  console.log('Favorite toggled:', gameId, isFavorite)
}
</script>
```

### MarqueeNotice Component

```vue
<template>
  <MarqueeNotice 
    :auto-fetch="true"
    :refresh-interval="60000"
  />
</template>

<script setup>
import MarqueeNotice from '@/components/games/MarqueeNotice.vue'
</script>
```

### WinTicker Component

```vue
<template>
  <WinTicker
    :auto-fetch="true"
    :refresh-interval="5000"
    :scroll-interval="3000"
    :max-display="50"
  />
</template>

<script setup>
import WinTicker from '@/components/games/WinTicker.vue'
</script>
```

---

## 🚀 Performance Optimization

### 1. Lazy Loading Images

All [`GameCard`](wap/src/components/games/GameCard.vue:40) components use Vant's lazy-load feature:

```vue
<van-image
  :src="game.image_url"
  lazy-load
  :show-loading="true"
/>
```

### 2. Database Indexing

The schema includes optimized indexes:

```sql
-- Composite index for category filtering
ALTER TABLE `games` ADD INDEX `idx_category_active` 
  (`category_id`, `is_active`, `sort_order`);

-- Index for recent wins query
ALTER TABLE `win_logs` ADD INDEX `idx_recent_wins` 
  (`created_at` DESC, `amount` DESC);
```

### 3. API Response Caching

Implement Redis caching in PHP:

```php
use support\Redis;

public function categories(Request $request): Response
{
    $cacheKey = 'game_categories';
    $cached = Redis::get($cacheKey);
    
    if ($cached) {
        return json(json_decode($cached, true));
    }
    
    $categories = Db::table('game_categories')
        ->where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->get();
    
    Redis::setex($cacheKey, 300, json_encode([
        'code' => 0,
        'data' => $categories
    ]));
    
    return json(['code' => 0, 'data' => $categories]);
}
```

### 4. Frontend Code Splitting

Configure Vite for optimal chunking in [`wap/vite.config.js`](wap/vite.config.js):

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'vant': ['vant'],
          'games': [
            './src/components/games/GameCard.vue',
            './src/components/games/MarqueeNotice.vue',
            './src/components/games/WinTicker.vue'
          ]
        }
      }
    }
  }
}
```

---

## 📱 Responsive Design

The system uses mobile-first CSS with breakpoints:

```css
/* Mobile (default) */
.games-grid {
  grid-template-columns: repeat(3, 1fr);
}

/* Small phones */
@media (max-width: 360px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets */
@media (min-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## 🔒 Security Best Practices

### 1. SQL Injection Prevention

Use parameterized queries:

```php
// ✅ Good - Using query builder
$games = Db::table('games')
    ->where('category_id', $category)
    ->get();

// ❌ Bad - Direct string concatenation
$games = Db::select("SELECT * FROM games WHERE category_id = '$category'");
```

### 2. XSS Prevention

Sanitize user input in Vue:

```vue
<template>
  <!-- Use v-text instead of v-html for user content -->
  <div v-text="userInput"></div>
  
  <!-- If HTML is needed, sanitize first -->
  <div v-safe-html="sanitizedHtml"></div>
</template>
```

### 3. Authentication

Implement JWT token validation:

```php
use Firebase\JWT\JWT;

public function launch(Request $request): Response
{
    $token = $request->header('Authorization');
    
    try {
        $decoded = JWT::decode($token, $key, ['HS256']);
        $userId = $decoded->user_id;
        
        // Proceed with game launch
    } catch (\Exception $e) {
        return json(['code' => 401, 'message' => 'Unauthorized'], 401);
    }
}
```

---

## 🧪 Testing

### Backend API Tests

```bash
cd /home/caipiao/boyue
php artisan test
```

### Frontend Unit Tests

```bash
cd /home/caipiao/wap
npm run test:unit
```

### E2E Tests

```bash
npm run test:e2e
```

---

## 📊 Monitoring & Analytics

### 1. Track Game Plays

```javascript
import { recordGamePlay } from '@/api/games'

const handleGameClick = async (game) => {
  await recordGamePlay(game.game_id)
  // Launch game
}
```

### 2. Error Tracking

```javascript
window.addEventListener('error', (event) => {
  // Send to error tracking service
  console.error('Global error:', event.error)
})
```

---

## 🚀 Deployment

### 1. Build Frontend

```bash
cd /home/caipiao/wap
npm run build
```

### 2. Deploy Backend

```bash
cd /home/caipiao/boyue
php start.php start -d
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /home/caipiao/wap/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vant UI Components](https://vant-ui.github.io/vant/)
- [Webman Framework](https://www.workerman.net/doc/webman/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review error logs in `boyue/runtime/logs/`
3. Check browser console for frontend errors
4. Verify database connections and queries

---

## 📝 License

This implementation guide is part of the F168 Gaming Platform project.

**Last Updated**: 2026-05-31