<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class FeeReceiptController extends Controller
{
    /**
     * GET /api/fee-receipts/{payment}
     * Generate a fee receipt for a payment
     */
    public function show(Request $request, Payment $payment)
    {


        $payment->load([
            'student',
            'academicYear',
            'term',
            'student.grade',
            'student.class',
        ]);

        return response()->json([
            'receipt_number' => 'RCT-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),

            'student' => [
                'id'               => $payment->student->id,
                'name'             => $payment->student->first_name . ' ' . $payment->student->last_name,
                'admission_number' => $payment->student->admission_number,
                'grade'            => $payment->student->grade->name ?? '-',
                'class'            => $payment->student->class->name ?? '-',
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

    public function pdf(Request $request, Payment $payment)
    {
        // 🔒 Lock rule: receipt must be immutable
        if ($payment->receipt_generated_at === null) {
            $payment->update([
                'receipt_generated_at' => now(),
                'receipt_number' => 'RCT-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),
            ]);
        }

        $payment->load([
            'student',
            'academicYear',
            'term',
            'student.grade',
            'student.class',
        ]);

        $pdf = Pdf::loadView('pdf.feereceipt', [
            'payment' => $payment,
        ])->setPaper([0, 0, 226.77, 566.93]); // 80mm receipt paper

        return $pdf->stream(
            $payment->receipt_number . '.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }
}
