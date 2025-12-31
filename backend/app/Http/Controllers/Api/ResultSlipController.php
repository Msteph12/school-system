<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Marks;
use App\Models\Exam;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;


class ResultSlipController extends Controller
{
    /**
     * GET /api/result-slips/{student}
     *
     * Required:
     * - exam_id
     * - academic_year_id
     * - term_id
     */
    public function show(Request $request, Student $student)
    {
        $data = $request->validate([
            'exam_id'           => 'required|exists:exams,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'term_id'           => 'required|exists:terms,id',
        ]);

        $exam = Exam::findOrFail($data['exam_id']);

        /**
         * Fetch marks for this exam only
         */
        $marks = Marks::with('subject')
            ->where('student_id', $student->id)
            ->where('exam_id', $exam->id)
            ->where('academic_year_id', $data['academic_year_id'])
            ->where('term_id', $data['term_id'])
            ->get();

        $results = $marks->map(function ($mark) {
            return [
                'subject' => $mark->subject->name,
                'score'   => $mark->score,
                'grade'   => $mark->grade_label,
            ];
        });

        return response()->json([
            'student' => [
                'id'   => $student->id,
                'name' => $student->first_name . ' ' . $student->last_name,
            ],

            'exam' => [
                'id'   => $exam->id,
                'name' => $exam->name,
                'date' => $exam->exam_date,
            ],

            'academic_year_id' => $data['academic_year_id'],
            'term_id'          => $data['term_id'],

            'results' => $results,
        ]);
    }

    /**
     * STUDENT VIEW (self only)
     * GET /api/my/result-slip?academic_year_id=&term_id=&exam_id=
     */
    public function myResultSlip(Request $request)
    {
        $student = Auth::user()->student;

        if (! $student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        return $this->show($request, $student);
    }

    /**
     * STAFF PDF
     * GET /api/result-slips/{student}/pdf
     */
    public function pdf(Request $request, Student $student)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'required|exists:terms,id',
            'exam_id'          => 'required|exists:exams,id',
        ]);

        $term = Term::findOrFail($data['term_id']);

        $marks = Marks::with(['subject', 'exam'])
            ->where('student_id', $student->id)
            ->where('academic_year_id', $data['academic_year_id'])
            ->where('term_id', $data['term_id'])
            ->where('exam_id', $data['exam_id'])
            ->get();

        $pdf = Pdf::loadView('results.result-slip', [
            'student' => $student,
            'marks'   => $marks,
            'term'    => $term,
        ]);

        return $pdf->stream(
            'result-slip-' . $student->admission_number . '.pdf'
        );
    }

    /**
     * STUDENT PDF (self only)
     * GET /api/my/result-slip/pdf
     */
    public function myResultSlipPdf(Request $request)
    {
        $student = Auth::user()->student;

        if (! $student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        return $this->pdf($request, $student);
    }
}
