<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\TermController;

Route::apiResource('academic-years', AcademicYearController::class);
Route::apiResource('terms', TermController::class);
