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


Route::apiResource('academic-years', AcademicYearController::class);
Route::apiResource('terms', TermController::class);
Route::apiResource('grades', GradeController::class);
Route::apiResource('school-classes', SchoolClassController::class);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('grade-subjects', GradeSubjectController::class)->only([
    'index', 'store', 'destroy']);
Route::apiResource('class-students', ClassStudentController::class)->only([
    'index', 'store', 'destroy']);
Route::apiResource('subject-teachers', SubjectTeacherController::class)->only([
    'index', 'store', 'destroy']);