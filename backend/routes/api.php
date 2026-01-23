<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\TermController;
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
use App\Http\Controllers\Api\TermClosureController;

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
| Authenticated (any logged-in user)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ONLY
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // Core setup
    Route::apiResource('academic-years', AcademicYearController::class)->except(['destroy']);
    Route::apiResource('terms', TermController::class)->except(['destroy']);
    Route::post('/terms/{term}/close', [TermController::class, 'close']);
    Route::post('/terms/{term}/activate', [TermController::class, 'activate']);
    Route::apiResource('grades', GradeController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('teachers', TeacherController::class);

    // Promotion history
    Route::get('/promotions/history', [PromotionHistoryController::class, 'index']);

    // Linking
    Route::apiResource('grade-subjects', GradeSubjectController::class)->only(['index','store','destroy']);
    Route::apiResource('subject-teachers', SubjectTeacherController::class)->only(['index','store','destroy']);

    // Class teachers
    Route::apiResource('class-teachers', ClassTeacherController::class)->only(['index', 'store', 'destroy']);
    Route::patch( 'class-teachers/{id}/unassign',[ClassTeacherController::class, 'unassign']);

    // Student fees manual adjustment
    Route::put('student-fees/{studentFee}', [StudentFeesController::class, 'update']);

    // Financial reports
    Route::get('reports/financial', [FinancialReportController::class, 'index']);

    // Finance overview
    Route::get('finance-overview', [FinanceOverviewController::class, 'index']);

    // Grade scales (full CRUD)
    Route::get('/grade-scales', [GradeScaleController::class, 'index']);
    Route::post('/grade-scales', [GradeScaleController::class, 'store']);
    Route::put('/grade-scales/{id}', [GradeScaleController::class, 'update']);
    Route::patch('/grade-scales/{id}/toggle-status', [GradeScaleController::class, 'toggleStatus']);
    Route::delete('/grade-scales/{id}', [GradeScaleController::class, 'destroy']);

    // Timetables (full CRUD)
   Route::get('timetables/by-class/{classId}', [TimetableController::class, 'byClass']);
   Route::get('timetables/export/{classId}', [TimetableController::class, 'export']);

   // Calendar events (full CRUD)
   Route::post('calendar-events', [CalendarEventController::class, 'store']);
   Route::put('calendar-events/{calendarEvent}', [CalendarEventController::class, 'update']);
   Route::delete('calendar-events/{calendarEvent}', [CalendarEventController::class, 'destroy']);

    // Exams (create/update/view – no delete)
    Route::apiResource('exams', ExamsController::class)->except(['destroy']);

    // Term closure
    Route::post('terms/{term}/close', [TermClosureController::class, 'close']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + REGISTRAR
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,registrar'])->group(function () {

    Route::apiResource('school-classes', SchoolClassController::class);
    Route::apiResource('class-students', ClassStudentController::class)->only(['index','store','destroy']);
    Route::post('promotions', [PromotionController::class, 'promote']);
    Route::apiResource('teacher-attendance', TeacherAttendanceController::class) ->except(['show']);
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

});



/*
|--------------------------------------------------------------------------
| TEACHER ONLY
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {

    // Teacher's own attendance records
    Route::get('my/attendance', [TeacherAttendanceController::class, 'myAttendance']);

    // Read-only grade scales
    Route::get('grade-scales', [GradeScaleController::class, 'index']);
    Route::get('grade-scales/{gradeScale}', [GradeScaleController::class, 'show']);

    // Read-only timetables
    Route::get('timetables', [TimetableController::class, 'index']);
    Route::get('timetables/{timetable}', [TimetableController::class, 'show']);

    // Read-only exams
    Route::get('exams', [ExamsController::class, 'index']);
    Route::get('exams/{exam}', [ExamsController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| ADMIN + TEACHER
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,teacher'])->group(function () {

    // Reports
    Route::get('reports/students-by-class', [ReportsController::class, 'studentsByClass']);
    Route::get('reports/student-attendance', [ReportsController::class, 'studentAttendance']);
    Route::get('reports/teacher-attendance', [ReportsController::class, 'teacherAttendance']);

    // Marks (full CRUD)
    Route::apiResource('marks', MarksController::class);

    Route::get('results/student/{student}', [ResultsController::class, 'studentResults']);

});

/*
|--------------------------------------------------------------------------
| ADMIN + ACCOUNTANT (FINANCE CORE)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,accountant'])->group(function () {

    // Fee structures
    Route::apiResource('fee-structures', FeeStructureController::class)->only(['index','store','update']);
    Route::get('fee-structures/{feeStructure}/print',[FeeStructurePrintController::class, 'print']);

    // Optional fees
    Route::apiResource('optional-fees', OptionalFeeController::class)->except(['show']);
    Route::post('students/{student}/optional-fees', [StudentOptionalFeeController::class, 'store']);

    // Student fees
    Route::get('student-fees', [StudentFeesController::class, 'index']);
    Route::post('student-fees/recalculate', [StudentFeesController::class, 'store']);
    Route::get('students/{student}/fees', [StudentFeesController::class, 'show']);
    Route::get('/student-fees/preview/{student}', [StudentFeesController::class, 'preview']);

    // Balances
    Route::get('students/{student}/balance', [StudentBalanceController::class, 'show']);

    // Payments
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments/{payment}', [PaymentController::class, 'show']); 
    Route::get('/students/by-admission/{admissionNo}', [StudentController::class, 'findByAdmission']);

    // Fee receipts
    Route::get('fee-receipts/{payment}', [FeeReceiptController::class, 'show']);
    Route::get('fee-receipts/{payment}/print', [FeeReceiptController::class, 'pdf']); 
});

/*
/-------------------------------------------------------------------------
| ADMIN + REGISTRAR + TEACHER
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin,registrar,teacher'])->group(function (){
    Route::get('result-slips/{student}', [ResultSlipController::class, 'show']);
    Route::get('result-slips/{student}/pdf', [ResultSlipController::class, 'pdf']);
    Route::get('report-cards/{student}', [ReportCardController::class, 'show'] );
    Route::get('report-cards/{student}/pdf', [ReportCardController::class, 'pdf']);
});



/*
|--------------------------------------------------------------------------
| STUDENT ONLY (SELF VIEW)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {

    // Optional fees (view)
    Route::get('optional-fees', [OptionalFeeController::class, 'index']);

    // Balance (own)
    Route::get('my/balance', function (Request $request) {
        return app(\App\Http\Controllers\Api\StudentBalanceController::class)
            ->show($request, $request->user()->student);
    });

    // Payments (own)
    Route::get('my/payments', function (Request $request) {
        return \App\Models\Payment::where('student_id', $request->user()->student_id)
            ->orderBy('payment_date', 'desc')
            ->get();
    });

    // Marks (own)
    Route::get('my/marks', function (Request $request) {
        return \App\Models\Marks::with([
                'exam',
                'subject',
                'academicYear',
                'term',
            ])
            ->where('student_id', $request->user()->student_id)
            ->orderBy('created_at', 'desc')
            ->get();
    });

    //Results (own)
    Route::get('my/results', function (Illuminate\Http\Request $request) {
        return app(\App\Http\Controllers\Api\ResultsController::class)
            ->studentResults(
                $request,
                $request->user()->student
            );
    });

    // Result slip (own)
    Route::get('my/result-slip', function (Illuminate\Http\Request $request) {
        return app(\App\Http\Controllers\Api\ResultSlipController::class)
            ->show(
                $request,
                $request->user()->student
            );
    });
    Route::get('my/result-slip/pdf', [ResultSlipController::class, 'myResultSlipPdf']);
});
