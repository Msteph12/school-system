<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use Barryvdh\DomPDF\Facade\Pdf;

class FeeStructurePrintController extends Controller
{
    // GET /api/fee-structures/{feeStructure}/print
    public function print(FeeStructure $feeStructure)
    {
        $feeStructure->load(['grade', 'term', 'academicYear']);

        $pdf = Pdf::loadView('pdf.fee-structure', [
            'fee' => $feeStructure,
        ]);

        return $pdf->download(
            'fee-structure-' . $feeStructure->grade->name . '.pdf'
        );
    }
}
