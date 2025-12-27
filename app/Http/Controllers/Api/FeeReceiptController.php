<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;

class FeeReceiptController extends Controller
{
    /**
     * GET /api/fee-receipts/{payment}
     * Generate a fee receipt for a payment
     */
    public function show(Payment $payment)
    {
        $payment->load([
            'student',
            'academicYear',
            'term',
        ]);

        return response()->json([
            'receipt_number' => 'RCT-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),

            'student' => [
                'id'              => $payment->student->id,
                'name'            => $payment->student->first_name . ' ' . $payment->student->last_name,
                'admission_number'=> $payment->student->admission_number,
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
