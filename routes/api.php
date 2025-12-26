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

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
Route::post('login', [AuthController::class, 'login']);

/*
|------------------ --------------------------------------------------------
| Authenticated (any logged-in user)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::apiResource('academic-years', AcademicYearController::class)
        ->except(['destroy']);
    Route::apiResource('terms', TermController::class)
        ->except(['destroy']);
    Route::apiResource('grades', GradeController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('teachers', TeacherController::class);

    Route::apiResource('grade-subjects', GradeSubjectController::class)
        ->only(['index','store','destroy']);

    Route::apiResource('subject-teachers', SubjectTeacherController::class)
        ->only(['index','store','destroy']);

});

/*
|--------------------------------------------------------------------------
| Admin + Registrar
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,registrar'])->group(function () {

    Route::apiResource('school-classes', SchoolClassController::class);

    Route::apiResource('class-students', ClassStudentController::class)
        ->only(['index','store','destroy']);

    Route::post('promotions', [PromotionController::class, 'promote']);

});

/*
|--------------------------------------------------------------------------
| Teacher only
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {

    Route::apiResource('teacher-attendance', TeacherAttendanceController::class)
        ->except(['destroy']);

    Route::apiResource('student-attendance', StudentAttendanceController::class)
        ->except(['destroy']);

});

/*
|--------------------------------------------------------------------------
| Admin + Teacher
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,teacher'])->group(function () {
    Route::get('reports/students-by-class', [ReportsController::class, 'studentsByClass']);
    Route::get('reports/student-attendance', [ReportsController::class, 'studentAttendance']);
    Route::get('reports/teacher-attendance', [ReportsController::class, 'teacherAttendance']);
});

