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

    // ✅ REQUIRED in Laravel 11 (do NOT remove)
    ->withExceptions(function (Exceptions $exceptions) {
        // Leave EMPTY — Laravel binds the default Handler internally
    })

    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        $middleware->redirectGuestsTo(function () {
        abort(401, 'Unauthenticated.');
    });
    })

    ->create();
