<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Usa o guard 'api' (JWT) para autenticar /broadcasting/auth
        Broadcast::routes([
            'middleware' => ['auth:api'],
            // Se sua API estiver em /api, descomente a linha abaixo e ajuste o authEndpoint no frontend
            // 'prefix' => 'api',
        ]);

        require base_path('routes/channels.php');
    }
}
