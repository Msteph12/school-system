<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class FeeReceiptController extends Controller
{
    /**
     * GET /api/fee-receipts/{payment}
     * Generate a fee receipt for a payment
     */
    public function show(Request $request, Payment $payment)
    {
        $user = $request->user();

        // 🔐 Access control
        if (
            ! in_array($user->role->name, ['admin', 'accountant']) &&
            ! ($user->role->name === 'student' && $payment->student->user_id === $user->id)
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $payment->load([
            'student',
            'academicYear',
            'term',
        ]);

        return response()->json([
            'receipt_number' => 'RCT-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),

            'student' => [
                'id'               => $payment->student->id,
                'name'             => $payment->student->first_name . ' ' . $payment->student->last_name,
                'admission_number' => $payment->student->admission_number,
            ],

            'academic_year' => $payment->academicYear->name,
            'term'          => $payment->term->name,

            'payment' => [
                'amount_paid'    => $payment->amount_paid,
                'payment_date'   => $payment->payment_date,
                'payment_method' => $payment->payment_method,
                'reference'      => $payment->reference,
            ],

            'issued_at' => now(),
        ]);
    }
}
