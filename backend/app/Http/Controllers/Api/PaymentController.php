<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\StudentFee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * GET /api/payments
     * Access controlled at route level
     */
    public function index(Request $request)
    {
        return Payment::with('student')
            ->when($request->student_id, fn ($q) =>
                $q->where('student_id', $request->student_id)
            )
            ->when($request->academic_year_id, fn ($q) =>
                $q->where('academic_year_id', $request->academic_year_id)
            )
            ->when($request->term_id, fn ($q) =>
                $q->where('term_id', $request->term_id)
            )
            ->orderBy('payment_date', 'desc')
            ->get();
    }

    /**
     * POST /api/payments
     * Admin / Accountant only (route middleware)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id'        => 'required|exists:students,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
            'amount_paid'       => 'required|numeric|min:0.01',
            'payment_date'      => 'required|date',
            'payment_method'    => 'required|string',
            'reference'         => 'nullable|string',
        ]);

        return DB::transaction(function () use ($data) {

            $payment = Payment::create($data);

            $studentFee = StudentFee::where('student_id', $data['student_id'])
                ->whereHas('feeStructure', fn ($q) =>
                    $q->where('academic_year_id', $data['academic_year_id'])
                      ->where('term_id', $data['term_id'])
                )
                ->first();

            if ($studentFee) {
                $studentFee->update([
                    'amount_due' => max(0, $studentFee->amount_due - $data['amount_paid']),
                ]);
            }

            return response()->json([
                'message' => 'Payment recorded successfully',
                'payment' => $payment,
            ], 201);
        });
    }

    /**
     * GET /api/payments/{payment}
     * Access controlled at route level
     */
    public function show(Payment $payment)
    {
        return $payment->load('student');
    }
}
