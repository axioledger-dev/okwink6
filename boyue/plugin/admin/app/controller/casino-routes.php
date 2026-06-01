<?php

/**
 * Casino Admin Routes
 * Auto-generated routes for HT Admin
 */

use Webman\Route;

// Casino Management Routes
Route::group('/app/admin/casino', function () {

    // Casino User Management
    Route::get('/user/list', [plugin\admin\app\controller\CasinoUserController::class, 'userList']);
    Route::get('/user/detail', [plugin\admin\app\controller\CasinoUserController::class, 'userDetail']);
    Route::post('/user/update', [plugin\admin\app\controller\CasinoUserController::class, 'user']);
    Route::post('/user/update-balance', [plugin\admin\app\controller\CasinoUserController::class, 'userBalance']);
    Route::post('/user/ban', [plugin\admin\app\controller\CasinoUserController::class, 'banCasinoUser']);

    // Casino Game Management
    Route::get('/game/list', [plugin\admin\app\controller\CasinoGameController::class, 'gameList']);
    Route::post('/game/add', [plugin\admin\app\controller\CasinoGameController::class, 'game']);
    Route::post('/game/edit', [plugin\admin\app\controller\CasinoGameController::class, 'game']);
    Route::post('/game/delete', [plugin\admin\app\controller\CasinoGameController::class, 'game']);
    Route::post('/game/toggle-status', [plugin\admin\app\controller\CasinoGameController::class, 'gameStatus']);

    // Casino Bet History
    Route::get('/bet/list', [plugin\admin\app\controller\CasinoBetController::class, 'betList']);
    Route::get('/bet/detail', [plugin\admin\app\controller\CasinoBetController::class, 'betDetail']);
    Route::get('/bet/statistics', [plugin\admin\app\controller\CasinoBetController::class, 'betStatistics']);

    // Casino Transaction Management
    Route::get('/transaction/list', [plugin\admin\app\controller\CasinoTransactionController::class, 'transactionList']);
    Route::post('/transaction/approve', [plugin\admin\app\controller\CasinoTransactionController::class, 'transaction']);
    Route::post('/transaction/reject', [plugin\admin\app\controller\CasinoTransactionController::class, 'transaction']);

    // Casino VIP Management
    Route::get('/vip/list', [plugin\admin\app\controller\CasinoVipController::class, 'vipList']);
    Route::post('/vip/add', [plugin\admin\app\controller\CasinoVipController::class, 'vip']);
    Route::post('/vip/edit', [plugin\admin\app\controller\CasinoVipController::class, 'vip']);
    Route::post('/vip/delete', [plugin\admin\app\controller\CasinoVipController::class, 'vip']);

    // Casino Banner Management
    Route::get('/banner/list', [plugin\admin\app\controller\CasinoBannerController::class, 'bannerList']);
    Route::post('/banner/add', [plugin\admin\app\controller\CasinoBannerController::class, 'banner']);
    Route::post('/banner/edit', [plugin\admin\app\controller\CasinoBannerController::class, 'banner']);
    Route::post('/banner/delete', [plugin\admin\app\controller\CasinoBannerController::class, 'banner']);

    // Casino Discount Management
    Route::get('/discount/list', [plugin\admin\app\controller\CasinoDiscountController::class, 'discountList']);
    Route::post('/discount/add', [plugin\admin\app\controller\CasinoDiscountController::class, 'discount']);
    Route::post('/discount/edit', [plugin\admin\app\controller\CasinoDiscountController::class, 'discount']);
    Route::post('/discount/delete', [plugin\admin\app\controller\CasinoDiscountController::class, 'discount']);

    // Casino Prize Management
    Route::get('/prize/list', [plugin\admin\app\controller\CasinoPrizeController::class, 'prizeList']);
    Route::post('/prize/add', [plugin\admin\app\controller\CasinoPrizeController::class, 'prize']);
    Route::post('/prize/edit', [plugin\admin\app\controller\CasinoPrizeController::class, 'prize']);
    Route::post('/prize/delete', [plugin\admin\app\controller\CasinoPrizeController::class, 'prize']);
    Route::get('/prize/history', [plugin\admin\app\controller\CasinoPrizeController::class, 'prizeHistory']);

    // Casino Settings Management
    Route::get('/settings/get', [plugin\admin\app\controller\CasinoSettingsController::class, 'settings']);
    Route::post('/settings/update', [plugin\admin\app\controller\CasinoSettingsController::class, 'settings']);
})->middleware([
    plugin\admin\app\middleware\JwtAuthMiddleware::class,
    plugin\admin\app\middleware\AccessControl::class
]);
