<?php

/**
 * Endpoints de autenticação da API.
 * Responsável por login, registro e
 * gerenciamento de tokens JWT.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthController extends Controller {
    /**
     * Login e criação de token JWT
     */
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $user = auth('api')->user();

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Registro de novo usuário
     */
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $roleUser = Role::firstOrCreate(['name' => 'user']);
        $user->assignRole($roleUser);

        // JWT login automático após registro
        $token = auth('api')->login($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Logout (revoga token JWT atual)
     */
    public function logout() {
        auth('api')->logout();
        return response()->json(['message' => 'Token revogado com sucesso.']);
    }

    /**
     * Informações do usuário autenticado
     */
    public function me() {
        return response()->json(auth('api')->user());
    }

    /**
     * Renovar token JWT
     */
    public function refresh() {
        $newToken = auth('api')->refresh();

        return response()->json([
            'token' => $newToken,
            'user' => auth('api')->user(),
        ]);
    }
}
