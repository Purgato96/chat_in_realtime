<?php

use Illuminate\Support\Facades\Route;

// =====================
// Apenas rotas básicas - SEM INERTIA
// =====================

// Página inicial básica (opcional)
Route::get('/', function () {
    return response()->json([
        'message' => 'Chat API Backend',
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
        'api_docs' => '/api/v1/status'
    ]);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'database' => \DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});

// CORS Preflight para desenvolvimento
Route::options('/{any}', function () {
    return response('', 200);
})->where('any', '.*');
