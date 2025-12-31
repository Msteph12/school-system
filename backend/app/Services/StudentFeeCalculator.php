<?php

namespace App\Services;

use App\Models\Student;
use App\Models\FeeStructure;
use App\Models\StudentFee;

class StudentFeeCalculator
{
    public function calculate(
        Student $student,
        FeeStructure $feeStructure,
        int $academicYearId,
        int $termId
    ): StudentFee {

        // 1. Base fee
        $baseAmount = $feeStructure->amount;

        // 2. Optional fees selected by student
        $optionalTotal = $student->optionalFees()
            ->where('academic_year_id', $academicYearId)
            ->where('term_id', $termId)
            ->sum('amount');

        // 3. Final amount
        $totalAmount = $baseAmount + $optionalTotal;

        // 4. Store or update student fee
        return StudentFee::updateOrCreate(
            [
                'student_id'       => $student->id,
                'fee_structure_id' => $feeStructure->id,
            ],
            [
                'amount_due' => $totalAmount,
            ]
        );
    }
}
