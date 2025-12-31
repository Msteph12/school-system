<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Marks;
use App\Models\Term;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    /**
     * GET /api/report-cards/{student}
     * Term-wide report card (all exams)
     */
    public function show(Request $request, Student $student)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'required|exists:terms,id',
        ]);

        $term = Term::findOrFail($data['term_id']);

        $marks = Marks::with(['subject'])
            ->where('student_id', $student->id)
            ->where('academic_year_id', $data['academic_year_id'])
            ->where('term_id', $data['term_id'])
            ->get();

        $subjects = $marks->groupBy('subject_id')->map(function ($rows) {
            return [
                'subject' => $rows->first()->subject->name,
                'average' => round($rows->avg('score'), 2),
                'grades'  => $rows->pluck('grade_label')->unique()->values(),
            ];
        })->values();

        return response()->json([
            'student' => [
                'id'   => $student->id,
                'name' => $student->first_name . ' ' . $student->last_name,
            ],
            'term'        => $term->name,
            'term_closed' => $term->is_closed,
            'status'      => $term->is_closed ? 'final' : 'provisional',
            'subjects'    => $subjects,
        ]);
    }

    /**
     * PDF Export
     * GET /api/report-cards/{student}/pdf
     */
    public function pdf(Request $request, Student $student)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'required|exists:terms,id',
        ]);

        $term = Term::findOrFail($data['term_id']);

        $marks = Marks::with(['subject'])
            ->where('student_id', $student->id)
            ->where('academic_year_id', $data['academic_year_id'])
            ->where('term_id', $data['term_id'])
            ->get();

        $subjects = $marks->groupBy('subject_id')->map(function ($rows) {
            return [
                'subject' => $rows->first()->subject->name,
                'average' => round($rows->avg('score'), 2),
            ];
        });

        $pdf = Pdf::loadView('results.report-card', [
            'student'  => $student,
            'term'     => $term,
            'subjects' => $subjects,
        ]);

        return $pdf->stream(
            'report-card-' . $student->admission_number . '.pdf'
        );
    }
}
