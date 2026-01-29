<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * POST /api/login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid login credentials',
            ], 401);
        }

        $user = User::with('role')->find(Auth::id());

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id'   => $user->id,
                'name' => $user->name,
                'role' => $user->role->name, // 👈 frontend expects string
            ],
            'token' => $token,
        ]);
    }

    /**
     * GET /api/me
     */
    public function me(Request $request)
    {
        $user = User::with('role')->find($request->user()->id);

        return response()->json([
            'id'   => $user->id,
            'name' => $user->name,
            'role' => $user->role->name,
        ]);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
