<?php

use App\Models\PrivateConversation;
use App\Models\Room;
use Illuminate\Support\Facades\Broadcast;

// =====================
// Canais baseados em Sanctum (não sessão)
// =====================

// Salas por slug
Broadcast::channel('room.{slug}', function ($user, $slug) {
    $room = Room::where('slug', $slug)->first();

    if (!$room) {
        return false;
    }

    // Se é privada, verifica se o usuário está na sala
    if ($room->is_private) {
        return $room->users()->where('user_id', $user->id)->exists();
    }

    // Sala pública - sempre permitir
    return true;
});

// Presença em salas por slug
Broadcast::channel('room.{slug}.presence', function ($user, $slug) {
    $room = Room::where('slug', $slug)->first();

    if (!$room) {
        return false;
    }

    // Mesmo check de acesso
    if ($room->is_private && !$room->users()->where('user_id', $user->id)->exists()) {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name
    ];
});

// Salas por ID (backup)
Broadcast::channel('room.{roomId}', function ($user, $roomId) {
    $room = Room::find($roomId);

    if (!$room) {
        return false;
    }

    if ($room->is_private) {
        return $room->users()->where('user_id', $user->id)->exists();
    }

    return true;
});

// Conversas privadas
Broadcast::channel('private-conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = PrivateConversation::find($conversationId);

    return $conversation &&
        ($conversation->user_one_id === $user->id || $conversation->user_two_id === $user->id);
});

// Canal do usuário
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
