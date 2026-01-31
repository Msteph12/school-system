<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Breeze / Sanctum Auth Check (REQUIRED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthPasswordController;

use App\Http\Controllers\Api\AdminDashboardController;

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\TermController;
use App\Http\Controllers\Api\ContextController;

use App\Http\Controllers\Api\StudentController;
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
use App\Http\Controllers\Api\PromotionHistoryController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\ClassTeacherController;

use App\Http\Controllers\Api\FeeStructureController;
use App\Http\Controllers\Api\FeeStructurePrintController;
use App\Http\Controllers\Api\OptionalFeeController;
use App\Http\Controllers\Api\StudentOptionalFeeController;
use App\Http\Controllers\Api\StudentFeesController;
use App\Http\Controllers\Api\StudentBalanceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\FeeReceiptController;
use App\Http\Controllers\Api\FinancialReportController;
use App\Http\Controllers\Api\FinanceOverviewController;

use App\Http\Controllers\Api\GradeScaleController;
use App\Http\Controllers\Api\MarksController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\ExamsController;
use App\Http\Controllers\Api\ExamTypeController;
use App\Http\Controllers\Api\ExamTimetableController;

use App\Http\Controllers\Api\ResultsController;
use App\Http\Controllers\Api\ResultSlipController;
use App\Http\Controllers\Api\ReportCardController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('forgot-password', [AuthPasswordController::class, 'forgot']);
    Route::post('reset-password', [AuthPasswordController::class, 'reset']);
});

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ONLY
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('context/current', [ContextController::class, 'current']);

    Route::apiResource('academic-years', AcademicYearController::class)->except(['destroy']);
    Route::apiResource('terms', TermController::class)->except(['destroy']);

    Route::post('terms/{term}/activate', [TermController::class, 'activate']);
    Route::post('terms/{term}/lock', [TermController::class, 'lock']);
    Route::post('terms/{term}/unlock', [TermController::class, 'unlock']);
    
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('teachers', TeacherController::class);

    Route::get('promotions/history', [PromotionHistoryController::class, 'index']);

    Route::apiResource('grade-subjects', GradeSubjectController::class)->only(['index','store','destroy']);
    Route::apiResource('subject-teachers', SubjectTeacherController::class)->only(['index','store','destroy']);

    Route::apiResource('class-teachers', ClassTeacherController::class)->only(['index','store','destroy']);
    Route::patch('class-teachers/{id}/unassign', [ClassTeacherController::class, 'unassign']);

    Route::put('student-fees/{studentFee}', [StudentFeesController::class, 'update']);

    Route::get('reports/financial', [FinancialReportController::class, 'index']);
    Route::get('finance-overview', [FinanceOverviewController::class, 'index']);

    Route::get('grade-scales', [GradeScaleController::class, 'index']);
    Route::post('grade-scales', [GradeScaleController::class, 'store']);
    Route::put('grade-scales/{id}', [GradeScaleController::class, 'update']);
    Route::patch('grade-scales/{id}/toggle-status', [GradeScaleController::class, 'toggleStatus']);
    Route::delete('grade-scales/{id}', [GradeScaleController::class, 'destroy']);

    Route::get('timetables/by-class/{classId}', [TimetableController::class, 'byClass']);
    Route::get('timetables/export/{classId}', [TimetableController::class, 'export']);

    Route::post('calendar-events', [CalendarEventController::class, 'store']);
    Route::put('calendar-events/{calendarEvent}', [CalendarEventController::class, 'update']);
    Route::delete('calendar-events/{calendarEvent}', [CalendarEventController::class, 'destroy']);

    Route::apiResource('exams', ExamsController::class)->except(['destroy']);
    Route::post('exams/{exam}/activate', [ExamsController::class, 'activate']);
    Route::post('exams/{exam}/close', [ExamsController::class, 'close']);

    Route::post('exam-timetables', [ExamTimetableController::class, 'store']);
    Route::post('exam-timetables/auto-generate', [ExamTimetableController::class, 'autoGenerate']);
    Route::get('exam-timetables/{id}', [ExamTimetableController::class, 'show']);
    Route::post('exam-timetables/{id}/publish', [ExamTimetableController::class, 'publish']);

    Route::get('exam-types', [ExamTypeController::class, 'index']);
    Route::post('exam-types', [ExamTypeController::class, 'store']);
    Route::put('exam-types/{id}', [ExamTypeController::class, 'update']);
    Route::delete('exam-types/{id}', [ExamTypeController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + REGISTRAR
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,registrar'])->group(function () {
    Route::get('grades', [GradeController::class, 'index']);
    Route::get('grades/{id}', [GradeController::class, 'show']);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('school-classes', SchoolClassController::class);
    Route::patch('school-classes/{id}/status', [SchoolClassController::class, 'toggleStatus']);
    Route::apiResource('class-students', ClassStudentController::class)->only(['index','store','destroy']);
    Route::post('promotions', [PromotionController::class, 'promote']);
    Route::apiResource('teacher-attendance', TeacherAttendanceController::class)->except(['show']);
    Route::get('calendar-events', [CalendarEventController::class, 'index']);
    Route::get('calendar-events/{calendarEvent}', [CalendarEventController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + TEACHER
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,teacher'])->group(function () {

    Route::get('student-attendance', [StudentAttendanceController::class, 'index']);
    Route::get('student-attendance/{studentAttendance}', [StudentAttendanceController::class, 'show']);
    Route::post('student-attendance', [StudentAttendanceController::class, 'store']);

    Route::get('reports/students-by-class', [ReportsController::class, 'studentsByClass']);
    Route::get('reports/student-attendance', [ReportsController::class, 'studentAttendance']);
    Route::get('reports/teacher-attendance', [ReportsController::class, 'teacherAttendance']);

    Route::get('marks', [MarksController::class, 'index']);
    Route::post('marks', [MarksController::class, 'store']);
    Route::get('marks/{mark}', [MarksController::class, 'show']);
    Route::put('marks/{mark}', [MarksController::class, 'update']);

    Route::get('results/student/{student}', [ResultsController::class, 'studentResults']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + ACCOUNTANT
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {

    Route::apiResource('fee-structures', FeeStructureController::class)->only(['index','store','update']);
    Route::get('fee-structures/{feeStructure}/print', [FeeStructurePrintController::class, 'print']);

    Route::apiResource('optional-fees', OptionalFeeController::class)->except(['show']);
    Route::post('students/{student}/optional-fees', [StudentOptionalFeeController::class, 'store']);

    Route::get('student-fees', [StudentFeesController::class, 'index']);
    Route::post('student-fees/recalculate', [StudentFeesController::class, 'store']);
    Route::get('students/{student}/fees', [StudentFeesController::class, 'show']);
    Route::get('student-fees/preview/{student}', [StudentFeesController::class, 'preview']);

    Route::get('students/{student}/balance', [StudentBalanceController::class, 'show']);

    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments/{payment}', [PaymentController::class, 'show']);
    Route::get('students/by-admission/{admissionNo}', [StudentController::class, 'findByAdmission']);

    Route::get('fee-receipts/{payment}', [FeeReceiptController::class, 'show']);
    Route::get('fee-receipts/{payment}/print', [FeeReceiptController::class, 'pdf']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + REGISTRAR + TEACHER
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,registrar,teacher'])->group(function () {
    Route::get('result-slips/{student}', [ResultSlipController::class, 'show']);
    Route::get('result-slips/{student}/pdf', [ResultSlipController::class, 'pdf']);
    Route::get('report-cards/{student}', [ReportCardController::class, 'show']);
    Route::get('report-cards/{student}/pdf', [ReportCardController::class, 'pdf']);
});
