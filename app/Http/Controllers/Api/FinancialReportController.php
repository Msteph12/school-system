<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentFee;
use App\Models\Payment;
use Illuminate\Http\Request;

class FinancialReportController extends Controller
{
    /**
     * GET /api/reports/financial
     *
     * Filters:
     * - academic_year_id (required)
     * - term_id (optional)
     * - grade_id (optional)
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'nullable|exists:terms,id',
            'grade_id'         => 'nullable|exists:grades,id',
        ]);

        $academicYearId = $data['academic_year_id'];
        $termId  = $data['term_id'] ?? null;
        $gradeId = $data['grade_id'] ?? null;

        /**
         * 1️⃣ TOTAL FEES EXPECTED
         * (via fee structures)
         */
        $totalFees = StudentFee::whereHas('feeStructure', function ($q) use ($academicYearId, $termId) {
                $q->where('academic_year_id', $academicYearId);

                if ($termId) {
                    $q->where('term_id', $termId);
                }
            })
            ->when($gradeId, function ($q) use ($gradeId) {
                $q->whereHas('student.classStudents.schoolClass', function ($q) use ($gradeId) {
                    $q->where('grade_id', $gradeId);
                });
            })
            ->sum('amount_due');

        /**
         * 2️⃣ TOTAL PAYMENTS RECEIVED
         */
        $totalPaid = Payment::where('academic_year_id', $academicYearId)
            ->when($termId, fn ($q) =>
                $q->where('term_id', $termId)
            )
            ->when($gradeId, function ($q) use ($gradeId) {
                $q->whereHas('student.classStudents.schoolClass', function ($q) use ($gradeId) {
                    $q->where('grade_id', $gradeId);
                });
            })
            ->sum('amount_paid');

        /**
         * 3️⃣ CALCULATIONS
         */
        $outstanding = max($totalFees - $totalPaid, 0);
        $excess      = max($totalPaid - $totalFees, 0);

        return response()->json([
            'academic_year_id' => $academicYearId,
            'term_id'          => $termId,
            'grade_id'         => $gradeId,

            'total_expected'   => $totalFees,
            'total_collected'  => $totalPaid,
            'outstanding'      => $outstanding,
            'excess'           => $excess,
        ]);
    }
}
