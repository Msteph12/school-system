<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentFee;
use App\Models\Payment;
use Illuminate\Http\Request;

class StudentBalanceController extends Controller
{
    /**
     * GET /api/students/{student}/balance
     */
    public function show(Request $request, Student $student)
    {
        $user = $request->user();

        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'required|exists:terms,id',
        ]);

        $academicYearId = $data['academic_year_id'];
        $termId         = $data['term_id'];

        /**
         * 1️⃣ Total fees due
         */
        $totalFees = StudentFee::where('student_id', $student->id)
            ->whereHas('feeStructure', fn ($q) =>
                $q->where('academic_year_id', $academicYearId)
                  ->where('term_id', $termId)
            )
            ->sum('amount_due');

        /**
         * 2️⃣ Total payments made
         */
        $totalPaid = Payment::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('term_id', $termId)
            ->sum('amount_paid');

        /**
         * 3️⃣ Balance calculation
         */
        $balance = $totalFees - $totalPaid;

        return response()->json([
            'student_id'        => $student->id,
            'academic_year_id'  => $academicYearId,
            'term_id'           => $termId,

            'total_fees'        => $totalFees,
            'total_paid'        => $totalPaid,

            'balance_due'       => $balance > 0 ? $balance : 0,
            'credit'            => $balance < 0 ? abs($balance) : 0,
        ]);
    }
}
