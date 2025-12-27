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
use App\Http\Controllers\Api\StudentBalanceController;
use App\Http\Controllers\Api\FeeReceiptController;
use App\Http\Controllers\Api\StudentOptionalFeeController;
use App\Http\Controllers\Api\OptionalFeeController;
use App\Http\Controllers\Api\FeeStructureController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StudentFeesController;
use App\Http\Controllers\Api\FinancialReportController;

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

/*
|--------------------------------------------------------------------------
| Admin + Accountant (Finance core)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {
    Route::apiResource('fee-structures', FeeStructureController::class)
        ->only(['index', 'store', 'update']);
});

/*
//--------------------------------------------------------------------------
/ Admin + Accountant 
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {
    Route::apiResource('optional-fees', OptionalFeeController::class)
        ->except(['show']);
});
/*Student view only
*/
Route::middleware('auth:sanctum')->get(
    'optional-fees',
    [OptionalFeeController::class, 'index']
);

/*
//--------------------------------------------------------------------------
/ Admin + Accountant 
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {
    Route::post(
        'students/{student}/optional-fees',
        [StudentOptionalFeeController::class, 'store']
    );
});

/*
//--------------------------------------------------------------------------
/ Admin + Accountant 
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {
    Route::get('student-fees', [StudentFeesController::class, 'index']);
    Route::post('student-fees/recalculate', [StudentFeesController::class, 'store']);
    Route::get('students/{student}/fees', [StudentFeesController::class, 'show']);
});

/*
//--------------------------------------------------------------------------
/ Admin Only
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::put('student-fees/{studentFee}', [StudentFeesController::class, 'update']);
});


/*
//--------------------------------------------------------------------------
/ Admin + Accountant 
//--------------------------------------------------------------------------
*/  
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->get(
    'students/{student}/balance',
    [StudentBalanceController::class, 'show']
);
/*Student view only
*/
Route::middleware(['auth:sanctum', 'role:student'])->get(
    'my/balance',
    function (Illuminate\Http\Request $request) {
        return app(\App\Http\Controllers\Api\StudentBalanceController::class)
            ->show(
                $request,
                $request->user()->student
            );
    }
);

/*
//--------------------------------------------------------------------------
/ Admin + Accountant
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->get(
    'fee-receipts/{payment}',
    [FeeReceiptController::class, 'show']
);

/*
//--------------------------------------------------------------------------
/ Admin Only
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('reports/financial', [FinancialReportController::class, 'index']);
});

/*
//--------------------------------------------------------------------------
/ Admin + Accountant 
//--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments/{payment}', [PaymentController::class, 'show']);
});
/*Student view only
*/
Route::middleware(['auth:sanctum', 'role:student'])->get(
    'my/payments',
    function (Illuminate\Http\Request $request) {
        return \App\Models\Payment::where('student_id', $request->user()->student_id)
            ->orderBy('payment_date', 'desc')
            ->get();
    }
);
