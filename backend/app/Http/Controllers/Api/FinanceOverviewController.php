<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanceOverviewController extends Controller
{
    public function index(Request $request)
    {
        $academicYearId = $request->academic_year_id;
        $termId = $request->term_id;

        // Total fees expected
        $totalFeesExpected = DB::table('student_fees')
            ->where('academic_year_id', $academicYearId)
            ->where('term_id', $termId)
            ->sum('amount');

        // Total paid
        $totalPaid = DB::table('payments')
            ->where('academic_year_id', $academicYearId)
            ->where('term_id', $termId)
            ->sum('amount');

        // Balance
        $totalBalance = $totalFeesExpected - $totalPaid;

        // Last payment date
        $lastPaymentDate = DB::table('payments')
            ->orderByDesc('created_at')
            ->value('created_at');

        return response()->json([
            'total_fees_expected' => $totalFeesExpected,
            'total_paid' => $totalPaid,
            'total_balance' => $totalBalance,
            'last_payment_date' => $lastPaymentDate,
        ]);
    }
}
