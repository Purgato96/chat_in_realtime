<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ChatAutoLoginController extends Controller
{
    /**
     * Autenticação automática para chat via parâmetros usando token Bearer Sanctum
     */
    public function autoLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'account_id' => 'required|string'
        ]);

        $email = $request->email;
        $accountId = $request->account_id;

        // Validação customizada do email placeholder
        if ($email === '{{Email}}') {
            return response()->json([
                'success' => false,
                'message' => 'Email não foi substituído corretamente'
            ], 400);
        }

        try {
            // Cria ou busca usuário
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $email,
                    'password' => bcrypt(Str::random(16))
                ]
            );

            // Autentica o usuário na sessão atual
            Auth::login($user);

            // Gera token pessoal para autenticação via Bearer Token
            $token = $user->createToken('chat-access-token')->plainTextToken;

            // Cria ou busca sala
            $room = Room::firstOrCreate(
                ['slug' => 'sala-' . $accountId],
                [
                    'name' => 'Espaço #' . $accountId,
                    'description' => 'Sala automática para account_id ' . $accountId,
                    'is_private' => true,
                    'created_by' => $user->id,
                ]
            );

            // Vincula usuário à sala
            if (!$room->users()->where('user_id', $user->id)->exists()) {
                $room->users()->attach($user->id, ['joined_at' => now()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Auto-login realizado com sucesso',
                'token' => $token,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ],
                    'room' => [
                        'id' => $room->id,
                        'slug' => $room->slug,
                        'name' => $room->name,
                        'description' => $room->description
                    ],
                    'account_id' => $accountId,
                    'redirect_to' => '/chat/room/' . $room->slug // Para o frontend usar
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro no auto-login',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
