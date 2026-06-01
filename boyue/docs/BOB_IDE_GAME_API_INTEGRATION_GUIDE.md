# TÀI LIỆU HƯỚNG DẪN TÍCH HỢP GAME API DÀNH CHO BOB IDE (AI ASSISTANT)

**Hệ thống:** BOYUE Platform  
**Backend Domain:** boyue.okwink6.com  
**Framework Backend:** PHP Webman Framework  
**Framework Frontend:** Vue.js (WAP Application)  
**Database:** MySQL  
**Cache:** Redis  
**Chế độ ví:** Ví đơn (Seamless / Single Wallet Mode)  
**Ngày cập nhật:** 2026-06-01

---

## 1. THÔNG SỐ CẤU HÌNH NHÀ CUNG CẤP (PROVIDER SETTINGS)

Bob IDE sử dụng các thông số thực tế dưới đây để cấu hình biến môi trường (`.env`) và khởi tạo kết nối API:

### Thông tin Provider
* **Môi trường:** Thử nghiệm (Staging)
* **Loại tiền tệ hệ thống game:** `VNDK`
* **API Base URL (Provider):** `https://dcyqv8f2id.com/api/v2`
* **Mã đại lý (Operator ID):** `dj-stg-vndk3`
* **Địa chỉ Backend Provider Admin:** `https://admin.dcyqv8f2id.com`
* **Tài khoản Đăng nhập Provider Admin:** `dj-stg-vndk3`
* **Mật khẩu Provider Admin:** `9wMqV4rAccgr4F`

*Lưu ý lấy API Key:* Đăng nhập vào Backend Admin của Provider phía trên, truy cập vào phần Profile ở góc trên bên phải để lấy **API Key** thực tế và cấu hình vào hệ thống.

### Địa chỉ Callback Hệ thống (Webhook URLs)

Dựa trên domain hệ thống `boyue.okwink6.com`, Bob IDE cần thiết lập các endpoint callback sau để cung cấp cho Nhà cung cấp:

* **Bet Callback (Đặt cược):** `https://boyue.okwink6.com/api/games/callback/bet`
* **Result Callback (Kết quả / Trả thưởng):** `https://boyue.okwink6.com/api/games/callback/result`
* **Refund Callback (Hoàn tiền):** `https://boyue.okwink6.com/api/games/callback/refund`
* **Balance Callback (Kiểm tra số dư):** `https://boyue.okwink6.com/api/games/callback/balance`

### Tài liệu tham khảo từ Provider (Mật khẩu truy cập chung: `1234567811`)

* **Tài liệu API chính:** `https://samyarieiv636.github.io/topapidoc.github.io/`
* **Hướng dẫn thao tác RTP:** `https://samyarieiv636.github.io/toprtpdoc.github.io/`
* **Giới thiệu chức năng Call:** `https://samyarieiv636.github.io/topcalldoc.github.io/`
* **Hướng dẫn thao tác Backend:** `https://samyarieiv636.github.io/topbackenddoc.github.io/`

---

## 2. CẤU TRÚC DATABASE ĐÃ CÓ (DATABASE SCHEMA)

Bob IDE bắt buộc phải sử dụng đúng cấu trúc các bảng dữ liệu sau đây khi sinh mã SQL Query hoặc Model (Sử dụng Sequelize / Eloquent hoặc Db class của Webman):

### Bảng `game_providers`

```sql
CREATE TABLE `game_providers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên nhà cung cấp',
  `code` VARCHAR(20) UNIQUE NOT NULL COMMENT 'Mã nhà cung cấp (Ví dụ: TOP, PG, TCG)',
  `api_url` VARCHAR(255) NOT NULL COMMENT 'URL API endpoint',
  `api_key` VARCHAR(255) NOT NULL COMMENT 'API Key mã hóa',
  `api_secret` VARCHAR(255) NOT NULL COMMENT 'API Secret mã hóa',
  `operator_id` VARCHAR(100) NOT NULL COMMENT 'Operator ID đại lý',
  `currency` VARCHAR(10) DEFAULT 'VNDK' COMMENT 'Loại tiền tệ mặc định',
  `language` VARCHAR(10) DEFAULT 'vi' COMMENT 'Ngôn ngữ mặc định',
  `callback_url` VARCHAR(255) NOT NULL COMMENT 'URL Callback cấu hình tại hệ thống',
  `webhook_secret` VARCHAR(255) DEFAULT NULL COMMENT 'Mã bí mật xác thực webhook signature',
  `status` TINYINT DEFAULT 0 COMMENT '0=inactive, 1=active',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
);
```

### Bảng `games`

```sql
CREATE TABLE `games` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `provider_id` INT NOT NULL COMMENT 'FK liên kết game_providers',
  `game_code` VARCHAR(50) NOT NULL COMMENT 'Mã game định danh từ Provider',
  `game_name` VARCHAR(200) NOT NULL COMMENT 'Tên hiển thị trò chơi',
  `game_type` VARCHAR(20) NOT NULL COMMENT 'Loại game: slot, live, sports...',
  `thumbnail` VARCHAR(255) DEFAULT NULL COMMENT 'URL hình ảnh đại diện game',
  `rtp` DECIMAL(5,2) DEFAULT NULL COMMENT 'Tỷ lệ hoàn trả cho người chơi %',
  `volatility` VARCHAR(20) DEFAULT NULL COMMENT 'Độ biến động game: low, medium, high',
  `max_win` INT DEFAULT NULL COMMENT 'Hệ số thắng tối đa',
  `status` TINYINT DEFAULT 1 COMMENT '0=inactive, 1=active',
  `sort_order` INT DEFAULT 0 COMMENT 'Thứ tự sắp xếp hiển thị',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  INDEX `idx_provider` (`provider_id`),
  INDEX `idx_type` (`game_type`),
  INDEX `idx_status` (`status`)
);
```

### Bảng `game_sessions`

```sql
CREATE TABLE `game_sessions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK liên kết users',
  `game_id` INT NOT NULL COMMENT 'FK liên kết games',
  `provider_id` INT NOT NULL COMMENT 'FK liên kết game_providers',
  `session_id` VARCHAR(100) NOT NULL COMMENT 'Session ID trả về từ Provider',
  `game_url` TEXT NOT NULL COMMENT 'URL khởi chạy game',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT 'active, completed, expired',
  `created_at` DATETIME NOT NULL,
  `expired_at` DATETIME DEFAULT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_session` (`session_id`)
);
```

### Bảng `game_transactions`

```sql
CREATE TABLE `game_transactions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK liên kết users',
  `game_id` INT NOT NULL COMMENT 'FK liên kết games',
  `provider_id` INT NOT NULL COMMENT 'FK liên kết game_providers',
  `game_round_id` VARCHAR(100) NOT NULL COMMENT 'Mã vòng chơi định danh từ Provider',
  `transaction_type` VARCHAR(20) NOT NULL COMMENT 'Loại giao dịch: bet, win, refund',
  `amount` DECIMAL(15,2) NOT NULL COMMENT 'Số tiền giao dịch',
  `balance_before` DECIMAL(15,2) NOT NULL COMMENT 'Số dư trước giao dịch',
  `balance_after` DECIMAL(15,2) NOT NULL COMMENT 'Số dư sau giao dịch',
  `status` VARCHAR(20) DEFAULT 'completed' COMMENT 'pending, completed, failed',
  `provider_txn_id` VARCHAR(100) DEFAULT NULL COMMENT 'Mã giao dịch từ Provider gửi sang',
  `created_at` DATETIME NOT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_game` (`game_id`),
  INDEX `idx_round` (`game_round_id`),
  INDEX `idx_provider_txn` (`provider_txn_id`),
  INDEX `idx_created` (`created_at`)
);
```

### Bảng `game_rounds`

```sql
CREATE TABLE `game_rounds` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK liên kết users',
  `game_id` INT NOT NULL COMMENT 'FK liên kết games',
  `provider_id` INT NOT NULL COMMENT 'FK liên kết game_providers',
  `round_id` VARCHAR(100) UNIQUE NOT NULL COMMENT 'Mã định danh vòng chơi từ Provider',
  `bet_amount` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Tổng tiền cược vòng này',
  `win_amount` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Tổng tiền thắng vòng này',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT 'active, settled, cancelled',
  `started_at` DATETIME NOT NULL,
  `settled_at` DATETIME DEFAULT NULL,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_round` (`round_id`),
  INDEX `idx_status` (`status`)
);
```

---

## 3. NHIỆM VỤ CHI TIẾT DÀNH CHO BOB IDE (TASKS & PROMPTS)

### Nhiệm vụ 1: Sinh mã Provider Adapter Class (PHP Webman)

Hãy tạo một class adapter nằm trong thư mục `boyue/app/service/games/TopProviderAdapter.php` để xử lý kết nối HTTP sang Provider API.

**Yêu cầu kỹ thuật:**

1. **Hàm tạo Chữ ký (Signature Generation):** Triển khai thuật toán tạo chữ ký số bảo mật bằng mã hóa HMAC-SHA256 theo quy tắc:
   ```
   string_to_sign = method + url + timestamp + body
   signature = HMAC_SHA256(string_to_sign, api_secret)
   ```

2. **Hàm `getGameList()`:** Gọi HTTP GET đến `https://dcyqv8f2id.com/api/v2/games/list`. Nhận danh sách game trả về và thực hiện đồng bộ (Insert/Update) vào bảng `games`.

3. **Hàm `launchGame($userId, $gameCode)`:**
   * Xác thực phiên làm việc của user (JWT Token), kiểm tra trạng thái hoạt động.
   * Gọi HTTP POST đến `https://dcyqv8f2id.com/api/v2/game/launch`.
   * Payload gửi đi bao gồm: 
     - `operator_id = "dj-stg-vndk3"`
     - `player_id = "user_" + userId`
     - `game_code = gameCode`
     - `currency = "VNDK"`
     - `language = "vi"`
     - `return_url = "https://boyue.okwink6.com/games"`
   * Khi Provider trả về `game_url` và `session_id`, lưu thông tin vào bảng `game_sessions` và trả về URL cho Frontend.

### Nhiệm vụ 2: Xây dựng Callback Controller xử lý Ví đơn (Seamless Wallet)

Tạo file `boyue/app/controller/api/GamesCallbackController.php` để tiếp nhận và xử lý các yêu cầu thay đổi số dư tài khoản từ máy chủ Provider gửi về hệ thống qua domain `boyue.okwink6.com`.

**Yêu cầu xử lý logic nghiệp vụ nghiêm ngặt:**

1. **Xác thực Signature Webhook:** Mọi request callback gửi tới đều phải đi qua bước kiểm tra chữ ký số dựa trên `X-Signature` header và mã bảo mật `webhook_secret` để chống giả mạo request.

2. **Cơ chế Idempotency (Chống lặp lệnh trùng lặp):**
   * Trước khi xử lý trừ/cộng tiền, phải kiểm tra xem `provider_txn_id` hoặc cặp (`game_round_id`, `transaction_type`) đã tồn tại trong bảng `game_transactions` chưa.
   * Nếu giao dịch đã được xử lý thành công trước đó, lập tức trả về phản hồi thành công kèm theo số dư hiện tại của người dùng mà không thực hiện thay đổi số dư lần hai.

3. **Xử lý Đặt cược (`/api/games/callback/bet`):**
   * Tiếp nhận thông tin cược: Số tiền cược (`bet_amount`), mã vòng chơi (`game_round_id`), ID người chơi (`player_id`).
   * Bắt đầu một **Database Transaction** (`Db::beginTransaction()`).
   * Sử dụng cơ chế khóa dòng (`SELECT balance FROM users WHERE id = ... FOR UPDATE`) để lấy số dư chính xác nhất.
   * Kiểm tra số dư, nếu đủ tiền:
     - Trừ tiền người dùng: `UPDATE users SET balance = balance - bet_amount WHERE id = ...`
     - Ghi log vào bảng `game_transactions` với `transaction_type = 'bet'`, tính toán trước và sau giao dịch (`balance_before`, `balance_after`).
     - Khởi tạo dòng mới trong bảng `game_rounds` với trạng thái `'active'`.
   * Hoàn tất và lưu dữ liệu (`Db::commit()`). Trả về cấu trúc JSON đúng định dạng Provider quy định: `{status: "success", balance: current_balance, transaction_id: local_txn_id}`.

4. **Xử lý Kết quả / Trả thưởng (`/api/games/callback/result`):**
   * Tiếp nhận thông tin thắng cược (`win_amount`), mã vòng chơi (`game_round_id`).
   * Khởi động **Database Transaction**.
   * Kiểm tra xem vòng chơi (`game_round_id`) đã được quyết toán (`settled`) hay chưa.
   * Cộng tiền thắng vào tài khoản người dùng: `UPDATE users SET balance = balance + win_amount WHERE id = ...`
   * Ghi log vào bảng `game_transactions` với `transaction_type = 'win'`.
   * Cập nhật trạng thái vòng chơi trong bảng `game_rounds` thành `'settled'` và cập nhật `win_amount`.
   * Hoàn tất lưu dữ liệu (`Db::commit()`). Trả về phản hồi JSON tương tự.

5. **Xử lý Hoàn tiền (`/api/games/callback/refund`):**
   * Trong trường hợp vòng chơi bị hủy từ phía nhà cung cấp, thực hiện cộng lại tiền cược tương ứng cho người dùng theo cơ chế Database Transaction an toàn.

6. **Xử lý Tra cứu Số dư (`/api/games/callback/balance`):**
   * Trả về số dư khả dụng thực tế của người dùng từ cơ sở dữ liệu hệ thống theo đúng định dạng được yêu cầu.

### Nhiệm vụ 3: Database Seeder SQL

Tạo câu lệnh INSERT SQL để thiết lập dữ liệu ban đầu cho Nhà cung cấp mới:

```sql
INSERT INTO `game_providers` (
  `name`, `code`, `api_url`, `api_key`, `api_secret`, 
  `operator_id`, `currency`, `language`, `callback_url`, 
  `status`, `created_at`, `updated_at`
) VALUES (
  'Top Game Provider', 
  'TOP', 
  'https://dcyqv8f2id.com/api/v2', 
  'PLACEHOLDER_API_KEY_FROM_PROFILE', 
  'PLACEHOLDER_SECRET', 
  'dj-stg-vndk3', 
  'VNDK', 
  'vi', 
  'https://boyue.okwink6.com/api/games/callback', 
  0, 
  NOW(), 
  NOW()
);
```

### Nhiệm vụ 4: Cấu hình Routes (boyue/config/route.php)

Thêm các route callback vào file `boyue/config/route.php`:

```php
<?php
use Webman\Route;

// Game API Routes
Route::group('/api/games', function () {
    // Launch game endpoint
    Route::post('/launch', [app\controller\api\GamesController::class, 'launch']);
    
    // Get game list
    Route::get('/list', [app\controller\api\GamesController::class, 'list']);
    
    // Callback endpoints from Provider
    Route::post('/callback/bet', [app\controller\api\GamesCallbackController::class, 'bet']);
    Route::post('/callback/result', [app\controller\api\GamesCallbackController::class, 'result']);
    Route::post('/callback/refund', [app\controller\api\GamesCallbackController::class, 'refund']);
    Route::post('/callback/balance', [app\controller\api\GamesCallbackController::class, 'balance']);
});
```

### Nhiệm vụ 5: Hướng dẫn kết nối Frontend Vue.js (WAP Application)

Sinh mã nguồn cho view component `wap/src/views/games/GamesHome.vue` hoặc một file service axios tương đương:

* Khi người dùng click vào một `GameCard.vue`, Frontend gửi một HTTP POST request đến Backend API: `https://boyue.okwink6.com/api/games/launch` kèm theo payload gồm `{ game_id: id, game_code: code }`.
* Tiếp nhận dữ liệu phản hồi dạng JSON. Nếu thành công (`code == 0`), lấy trường `game_url` có trong data để mở trò chơi trong một cửa sổ trình duyệt mới (`window.open(game_url, '_blank')`) hoặc nhúng trực tiếp thông qua thẻ `<iframe>` toàn màn hình tùy thuộc vào giao diện thiết bị.

**Ví dụ code Frontend (wap/src/api/games.js):**

```javascript
import request from '@/utils/request'

// Launch game
export function launchGame(data) {
  return request({
    url: '/api/games/launch',
    method: 'post',
    data
  })
}

// Get game list
export function getGameList(params) {
  return request({
    url: '/api/games/list',
    method: 'get',
    params
  })
}
```

---

## 4. QUY TẮC PHÁT TRIỂN & BẢO MẬT BẮT BUỘC (CRITICAL CODE STANDARDS)

1. **Giao dịch Cơ sở dữ liệu (Database Transactions):** Bắt buộc phải bọc toàn bộ logic thay đổi số dư (Cược, Trả thưởng, Hoàn tiền) trong cấu trúc giao dịch (`Db::beginTransaction()`, `Db::commit()`, `Db::rollback()`). Không chấp nhận bất kỳ hành vi xử lý số dư nào nằm ngoài Transaction.

2. **Quản lý bộ nhớ Cache (Redis Caching):** Cấu hình cache cho cấu trúc thông tin nhà cung cấp game (`game_provider_config:{id}`) và danh sách trò chơi để giảm tải cho database MySQL. Thực hiện xóa hoặc làm mới cache (`Redis::del`) ngay khi admin thực hiện cập nhật thông số cấu hình tại màn hình quản trị.

3. **Xử lý Ngoại lệ và Ghi nhật ký hệ thống (Error Handling & Logging):** Tất cả các tiến trình gọi API ra bên ngoài mạng internet đều phải sử dụng khối lệnh `try...catch`. Toàn bộ dữ liệu Request và Response từ nhà cung cấp lỗi/thành công phải được ghi lại chi tiết trong file log theo các cấp độ `INFO` và `ERROR` phục vụ mục đích giám sát đối soát sau này.

4. **Bảo mật Webhook:** Luôn xác thực chữ ký số (signature) của mọi request callback từ Provider để đảm bảo tính toàn vẹn và xác thực nguồn gốc.

5. **Idempotency:** Đảm bảo mọi giao dịch tài chính chỉ được xử lý một lần duy nhất, ngay cả khi Provider gửi request trùng lặp.

---

## 5. ENDPOINT MAPPING SUMMARY

### Backend API Endpoints (boyue.okwink6.com)

| Endpoint | Method | Purpose | Controller |
|----------|--------|---------|------------|
| `/api/games/launch` | POST | Khởi chạy game | GamesController::launch |
| `/api/games/list` | GET | Lấy danh sách game | GamesController::list |
| `/api/games/callback/bet` | POST | Xử lý đặt cược | GamesCallbackController::bet |
| `/api/games/callback/result` | POST | Xử lý kết quả | GamesCallbackController::result |
| `/api/games/callback/refund` | POST | Xử lý hoàn tiền | GamesCallbackController::refund |
| `/api/games/callback/balance` | POST | Kiểm tra số dư | GamesCallbackController::balance |

### Provider API Endpoints (dcyqv8f2id.com)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v2/games/list` | GET | Lấy danh sách game từ Provider |
| `/api/v2/game/launch` | POST | Yêu cầu khởi chạy game |

---

## 6. ENVIRONMENT VARIABLES (.env)

Thêm các biến môi trường sau vào file `boyue/.env`:

```env
# Top Game Provider Configuration
TOP_PROVIDER_API_URL=https://dcyqv8f2id.com/api/v2
TOP_PROVIDER_API_KEY=YOUR_API_KEY_FROM_PROFILE
TOP_PROVIDER_API_SECRET=YOUR_API_SECRET
TOP_PROVIDER_OPERATOR_ID=dj-stg-vndk3
TOP_PROVIDER_CURRENCY=VNDK
TOP_PROVIDER_LANGUAGE=vi
TOP_PROVIDER_CALLBACK_URL=https://boyue.okwink6.com/api/games/callback
TOP_PROVIDER_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

---

## 7. TESTING CHECKLIST

- [ ] Đăng nhập Provider Admin và lấy API Key
- [ ] Cấu hình callback URLs tại Provider Admin
- [ ] Tạo bảng database theo schema
- [ ] Insert provider configuration vào database
- [ ] Test API signature generation
- [ ] Test game list synchronization
- [ ] Test game launch flow
- [ ] Test bet callback với transaction
- [ ] Test result callback với transaction
- [ ] Test refund callback
- [ ] Test balance callback
- [ ] Test idempotency (gửi request trùng lặp)
- [ ] Kiểm tra logs
- [ ] Test frontend integration

---

**Tài liệu này được tạo để hỗ trợ Bob IDE trong việc sinh code chính xác cho hệ thống BOYUE Platform.**