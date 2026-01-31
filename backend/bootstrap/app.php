<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    // ✅ REQUIRED in Laravel 11
    ->withExceptions(function (Exceptions $exceptions) {
        // Leave empty — Laravel binds default handler internally
    })

    ->withMiddleware(function (Middleware $middleware): void {

        /*
        |--------------------------------------------------------------------------
        | API Middleware
        |--------------------------------------------------------------------------
        | Option A: Bearer Token Auth (NO cookies)
        |--------------------------------------------------------------------------
        */

        // ❌ DO NOT use EnsureFrontendRequestsAreStateful
        // This breaks token-based auth

        /*
        |--------------------------------------------------------------------------
        | Middleware Aliases
        |--------------------------------------------------------------------------
        */
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role'     => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Force API-style unauthenticated response
        |--------------------------------------------------------------------------
        */
        $middleware->redirectGuestsTo(function () {
            abort(401, 'Unauthenticated.');
        });
    })

    ->create();
