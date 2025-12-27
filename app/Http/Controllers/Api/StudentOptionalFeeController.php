<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\FeeStructure;
use App\Services\StudentFeeCalculator;
use Illuminate\Http\Request;

class StudentOptionalFeeController extends Controller
{
    /**
     * POST /api/students/{student}/optional-fees
     *
     * Assign optional fees to a student for a specific academic year & term
     */
    public function store(Request $request, Student $student)
    {
        // 1️⃣ Validate request
        $data = $request->validate([
            'optional_fee_ids'   => 'array',
            'optional_fee_ids.*' => 'exists:optional_fees,id,is_active,1',

            'academic_year_id'   => 'required|exists:academic_years,id',
            'term_id'            => 'required|exists:terms,id',
            'fee_structure_id'   => 'required|exists:fee_structures,id',
        ]);

        $academicYearId = $data['academic_year_id'];
        $termId         = $data['term_id'];

        $feeStructure = FeeStructure::findOrFail($data['fee_structure_id']);

        /**
         * 2️⃣ Sync optional fees (clean replace per term & year)
         */
        $syncData = [];

        foreach ($data['optional_fee_ids'] ?? [] as $optionalFeeId) {
            $syncData[$optionalFeeId] = [
                'academic_year_id' => $academicYearId,
                'term_id'          => $termId,
            ];
        }

        // Remove old selections for this term/year and attach new ones
        $student->optionalFees()
            ->wherePivot('academic_year_id', $academicYearId)
            ->wherePivot('term_id', $termId)
            ->detach();

        if (!empty($syncData)) {
            $student->optionalFees()->attach($syncData);
        }

        /**
         * 3️⃣ Recalculate student fee
         */
        $calculator = new StudentFeeCalculator();

        $studentFee = $calculator->calculate(
            $student,
            $feeStructure,
            $academicYearId,
            $termId
        );

        return response()->json([
            'message'      => 'Optional fees updated successfully',
            'student_fee'  => $studentFee,
        ]);
    }
}
