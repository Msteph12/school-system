<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentFee;
use App\Models\FeeStructure;
use App\Services\StudentFeeCalculator;
use Illuminate\Http\Request;

class StudentFeesController extends Controller
{
    /**
     * GET /api/student-fees
     * List all student fees
     */
    public function index()
    {
        return StudentFee::with([
            'student',
            'feeStructure',
        ])->get();
    }

    /**
     * GET /api/students/{student}/fees
     * View fees for a specific student
     */
    public function show(Student $student)
    {
        return StudentFee::where('student_id', $student->id)
            ->with('feeStructure')
            ->get();
    }

    /**
     * POST /api/student-fees/recalculate
     * Recalculate and store student fee
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id'        => 'required|exists:students,id',
            'fee_structure_id'  => 'required|exists:fee_structures,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
        ]);

        $student = Student::findOrFail($data['student_id']);
        $feeStructure = FeeStructure::findOrFail($data['fee_structure_id']);

        $calculator = new StudentFeeCalculator();

        $studentFee = $calculator->calculate(
            $student,
            $feeStructure,
            $data['academic_year_id'],
            $data['term_id']
        );

        return response()->json([
            'message' => 'Student fee calculated successfully',
            'data'    => $studentFee,
        ]);
    }

    /**
     * PUT /api/student-fees/{studentFee}
     * Allow controlled admin adjustment ONLY if needed
     */
    public function update(Request $request, StudentFee $studentFee)
    {
        $data = $request->validate([
            'amount_due' => 'required|numeric|min:0',
        ]);

        $studentFee->update($data);

        return response()->json([
            'message' => 'Student fee updated successfully',
            'data'    => $studentFee,
        ]);
    }
}
