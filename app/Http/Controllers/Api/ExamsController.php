<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;

class ExamsController extends Controller
{
    /**
     * GET /api/exams
     * List exams (filterable)
     */
    public function index(Request $request)
    {
        return Exam::with([
                'class',
                'subject',
                'academicYear',
                'term',
            ])
            ->when($request->class_id, fn ($q) =>
                $q->where('class_id', $request->class_id)
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
            ->orderBy('exam_date')
            ->get();
    }

    /**
     * POST /api/exams
     * Create an exam
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'class_id'          => 'required|exists:school_classes,id',
            'subject_id'        => 'required|exists:subjects,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
            'exam_date'         => 'required|date',
        ]);

        $exam = Exam::create($data);

        return response()->json([
            'message' => 'Exam created successfully',
            'exam' => $exam,
        ], 201);
    }

    /**
     * GET /api/exams/{exam}
     */
    public function show(Exam $exam)
    {
        return $exam->load([
            'class',
            'subject',
            'academicYear',
            'term',
        ]);
    }

    /**
     * PUT /api/exams/{exam}
     * Update exam details
     */
    public function update(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'exam_date'  => 'required|date',
        ]);

        $exam->update($data);

        return response()->json([
            'message' => 'Exam updated successfully',
            'exam' => $exam,
        ]);
    }
}
