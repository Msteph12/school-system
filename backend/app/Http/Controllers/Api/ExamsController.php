<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\AcademicYear;
use App\Models\Term;
use Illuminate\Http\Request;

class ExamsController extends Controller
{
    /**
     * GET /api/exams
     */
    public function index(Request $request)
    {
        return Exam::with([
                'schoolClass',
                'subject',
                'academicYear',
                'term',
                'examType'
            ])
            ->when($request->class_id, function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            })
            ->when($request->subject_id, function ($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            })
            ->when($request->academic_year_id, function ($q) use ($request) {
                $q->where('academic_year_id', $request->academic_year_id);
            })
            ->when($request->term_id, function ($q) use ($request) {
                $q->where('term_id', $request->term_id);
            })
            ->orderBy('exam_date')
            ->get();
    }

    /**
     * POST /api/exams
     */
    public function store(Request $request)
    {
         if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')
                ->store('exam-attachments', 'public');
        }
        
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'exam_type_id'      => 'required|exists:exam_types,id',
            'class_id'          => 'required|exists:school_classes,id',
            'subject_id'        => 'required|exists:subjects,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
            'exam_date'         => 'required|date',
            'total_marks'       => 'required|integer|min:1',
            'status'            => 'nullable|in:scheduled,active,completed',
            'attachment'        => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $term = Term::findOrFail($data['term_id']);
        if ($term->is_closed) {
            return response()->json([
                'message' => 'This term is closed. Exams cannot be created.',
            ], 423);
        }

        $year = AcademicYear::findOrFail($data['academic_year_id']);
        if ($year->isClosed()) {
            return response()->json([
                'message' => 'This academic year is closed. Exams cannot be created.',
            ], 423);
        }

        $exam = Exam::create($data);

        return response()->json([
            'message' => 'Exam created successfully',
            'exam' => $exam->load([
                'schoolClass',
                'subject',
                'academicYear',
                'term',
                'examType'
            ]),
        ], 201);
    }

    /**
     * GET /api/exams/{exam}
     */
    public function show(Exam $exam)
    {
        return $exam->load([
            'schoolClass',
            'subject',
            'academicYear',
            'term',
            'examType'
        ]);
    }

    /**
     * PUT /api/exams/{exam}
     */
    public function update(Request $request, Exam $exam)
    {
        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')
                ->store('exam-attachments', 'public');
        }

        if ($exam->term && $exam->term->is_closed) {
            return response()->json([
                'message' => 'This term is closed. Exams cannot be modified.',
            ], 423);
        }

        $data = $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'exam_date'    => 'sometimes|required|date',
            'total_marks'  => 'sometimes|required|integer|min:1',
            'status'       => 'sometimes|in:scheduled,active,completed',
            'attachment'   => 'nullable|string',
        ]);

        $exam->update($data);

        return response()->json([
            'message' => 'Exam updated successfully',
            'exam' => $exam->load([
                'schoolClass',
                'subject',
                'academicYear',
                'term',
                'examType'
            ]),
        ]);
    }

    /**
     * PATCH /api/exams/{exam}/activate
     */
    public function activate(Exam $exam)
    {
        $exam->update(['status' => 'active']);
        return response()->json($exam);
    }

    /**
     * PATCH /api/exams/{exam}/close
     */
    public function close(Exam $exam)
    {
        $exam->update(['status' => 'completed']);
        return response()->json($exam);
    }
}
