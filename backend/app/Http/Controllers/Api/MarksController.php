<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marks;
use App\Models\Exam;
use App\Models\GradeScale;
use Illuminate\Http\Request;

class MarksController extends Controller
{
    /**
     * GET /api/marks
     */
    public function index(Request $request)
    {
        return Marks::with(['student', 'exam', 'gradeScale'])
            ->when($request->exam_id, fn ($q) =>
                $q->where('exam_id', $request->exam_id)
            )
            ->when($request->student_id, fn ($q) =>
                $q->where('student_id', $request->student_id)
            )
            ->get();
    }

    /**
     * POST /api/marks
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id'      => 'required|exists:students,id',
            'exam_id'         => 'required|exists:exams,id',
            'grade_scale_id'  => 'required|exists:grade_scales,id',
            'marks_obtained'  => 'required|numeric|min:0',
            'remarks'         => 'nullable|string',
        ]);

        /**
         * 🔒 Block if exam is locked
         */
        $exam = Exam::findOrFail($data['exam_id']);

        if ($exam->is_locked) {
            abort(403, 'This exam is locked. Marks cannot be entered.');
        }

        $mark = Marks::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'exam_id'    => $data['exam_id'],
            ],
            [
                'grade_scale_id' => $data['grade_scale_id'],
                'marks_obtained' => $data['marks_obtained'],
                'remarks'        => $data['remarks'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Marks saved successfully',
            'mark'    => $mark->load(['student', 'exam', 'gradeScale']),
        ], 201);
    }

    /**
     * GET /api/marks/{mark}
     */
    public function show(Marks $mark)
    {
        return $mark->load(['student', 'exam', 'gradeScale']);
    }

    /**
     * PUT /api/marks/{mark}
     */
    public function update(Request $request, Marks $mark)
    {
        $data = $request->validate([
            'grade_scale_id' => 'required|exists:grade_scales,id',
            'marks_obtained' => 'required|numeric|min:0',
            'remarks'        => 'nullable|string',
        ]);

        $mark->update($data);

        return response()->json([
            'message' => 'Marks updated successfully',
            'mark'    => $mark->load(['student', 'exam', 'gradeScale']),
        ]);
    }
}
