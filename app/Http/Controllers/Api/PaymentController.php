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
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Payment::with('student')
            ->orderBy('payment_date', 'desc');

        // Student: only their own payments
        if ($user->role->name === 'student') {
            $query->where('student_id', $user->id);
        }

        // Admin / Accountant: allow filters
        if (in_array($user->role->name, ['admin', 'accountant'])) {
            $query
                ->when($request->student_id, fn ($q) =>
                    $q->where('student_id', $request->student_id)
                )
                ->when($request->academic_year_id, fn ($q) =>
                    $q->where('academic_year_id', $request->academic_year_id)
                )
                ->when($request->term_id, fn ($q) =>
                    $q->where('term_id', $request->term_id)
                );
        }

        return $query->get();
    }

    /**
     * POST /api/payments
     * Admin + Accountant only (route-level protection)
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
                $remaining = $studentFee->amount_due - $data['amount_paid'];

                $studentFee->update([
                    'amount_due' => max(0, $remaining),
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
     */
    public function show(Request $request, Payment $payment)
    {
        $user = $request->user();

        // Student: ownership check
        if ($user->role->name === 'student' && $payment->student_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return $payment->load('student');
    }
}
