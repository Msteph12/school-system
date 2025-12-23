<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\TermController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\GradeSubjectController;
use App\Http\Controllers\Api\ClassStudentController;
use App\Http\Controllers\Api\SubjectTeacherController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\StudentAttendanceController;
use App\Http\Controllers\Api\TeacherAttendanceController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\AuthController;


Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('academic-years', AcademicYearController::class);
    Route::apiResource('terms', TermController::class);
    Route::apiResource('grades', GradeController::class);
    Route::apiResource('school-classes', SchoolClassController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('grade-subjects', GradeSubjectController::class)->only(['index','store','destroy']);
    Route::apiResource('class-students', ClassStudentController::class)->only(['index','store','destroy']);
    Route::apiResource('subject-teachers', SubjectTeacherController::class)->only(['index','store','destroy']);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('student-attendance', StudentAttendanceController::class)->except(['destroy']);
    Route::apiResource('teacher-attendance', TeacherAttendanceController::class)->except(['destroy']);

    Route::post('promotions', [PromotionController::class, 'promote']);
    Route::get('reports', [ReportsController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin', function () {
    return response()->json(['message' => 'Admin only']);
});

Route::middleware(['auth:sanctum', 'role:admin'])
    ->get('/admin-test', function () {
        return response()->json([
            'message' => 'Admin access confirmed'
        ]);
    });

