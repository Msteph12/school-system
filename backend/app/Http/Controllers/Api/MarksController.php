<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marks;
use App\Models\Exam;
use App\Models\Term;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class MarksController extends Controller
{
    /**
     * GET /api/marks
     */
    public function index(Request $request)
    {
        return Marks::with([
                'student',
                'exam',
                'subject',
                'academicYear',
                'term',
            ])
            ->when($request->student_id, fn ($q) =>
                $q->where('student_id', $request->student_id)
            )
            ->when($request->exam_id, fn ($q) =>
                $q->where('exam_id', $request->exam_id)
            )
            ->when($request->subject_id, fn ($q) =>
                $q->where('subject_id', $request->subject_id)
            )
            ->when($request->academic_year_id, fn ($q) =>
                $q->where('academic_year_id', $request->academic_year_id)
            )
            ->when($request->term_id, fn ($q) =>
                $q->where('term_id', $request->term_id)
            )
            ->get();
    }

    /**
     * POST /api/marks
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id'        => 'required|exists:students,id',
            'exam_id'           => 'required|exists:exams,id',
            'subject_id'        => 'required|exists:subjects,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
            'score'             => 'required|numeric|min:0',
            'grade_label'       => 'required|string',
        ]);

        /**
         * 🔒 Block uploads if term is closed
         */
        $term = Term::findOrFail($data['term_id']);

        if ($term->is_closed) {
            abort(403, 'This term is closed. Marks cannot be uploaded.');
        }

        /**
         * 🔒 Ensure exam belongs to same term & year
         */
        $exam = Exam::findOrFail($data['exam_id']);

        if (
            $exam->term_id !== (int) $data['term_id'] ||
            $exam->academic_year_id !== (int) $data['academic_year_id']
        ) {
            return response()->json([
                'message' => 'Exam does not belong to the selected term or academic year.',
            ], 422);
        }

        $year = AcademicYear::findOrFail($data['academic_year_id']);

        if ($year->isClosed()) {
            return response()->json([
                'message' => 'This academic year is closed. Marks cannot be uploaded.',
            ], 423);
        }

        $mark = Marks::updateOrCreate(
            [
                'student_id'       => $data['student_id'],
                'exam_id'          => $data['exam_id'],
                'subject_id'       => $data['subject_id'],
                'academic_year_id' => $data['academic_year_id'],
                'term_id'          => $data['term_id'],
            ],
            [
                'score'       => $data['score'],
                'grade_label' => $data['grade_label'],
            ]
        );

        return response()->json([
            'message' => 'Marks saved successfully',
            'mark'    => $mark,
        ], 201);
    }

    /**
     * PUT /api/marks/{mark}
     */
    public function update(Request $request, Marks $mark)
    {
        /**
         * 🔒 Block edits if term is closed
         */
        if ($mark->term->is_closed) {
            abort(403, 'This term is closed. Marks cannot be modified.');
        }

        $data = $request->validate([
            'score'       => 'required|numeric|min:0',
            'grade_label' => 'required|string',
        ]);

        $mark->update($data);

        return response()->json([
            'message' => 'Marks updated successfully',
            'mark'    => $mark,
        ]);
    }

    /**
     * GET /api/marks/{mark}
     */
    public function show(Marks $mark)
    {
        return $mark->load([
            'student',
            'exam',
            'subject',
            'academicYear',
            'term',
        ]);
    }
}
