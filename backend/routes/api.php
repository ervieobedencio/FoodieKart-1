<?php

use Illuminate\Support\Facades\Route;

// Public routes - no auth needed
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Public product listing
Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);

// Protected routes - authenticated users
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'me']);

    // Customer routes
    Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class, 'store']);
    Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'adminIndex']);
        Route::patch('/orders/{order}', [\App\Http\Controllers\Api\OrderController::class, 'updateStatus']);

        Route::post('/products', [\App\Http\Controllers\Api\ProductController::class, 'store']);
        Route::put('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'update']);
        Route::delete('/products/{product}', [\App\Http\Controllers\Api\ProductController::class, 'destroy']);
    });
});
