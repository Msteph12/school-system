<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Marks;
use App\Models\Term;
use Illuminate\Http\Request;

class ResultsController extends Controller
{
    /**
     * GET /api/results/student/{student}
     *
     * Required:
     * - academic_year_id
     * - term_id
     */
    public function studentResults(Request $request, Student $student)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id'          => 'required|exists:terms,id',
        ]);

        $academicYearId = $request->academic_year_id;
        $termId = $request->term_id;

        $term = Term::findOrFail($termId);

        /**
         * Fetch marks
         */
        $marks = Marks::with(['subject', 'exam'])
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('term_id', $termId)
            ->get();

        /**
         * Group by subject
         */
        $results = $marks->groupBy('subject_id')->map(function ($subjectMarks) {
            return [
                'subject' => $subjectMarks->first()->subject->name,
                'average_score' => round($subjectMarks->avg('score'), 2),
                'grade_labels' => $subjectMarks->pluck('grade_label')->unique()->values(),
                'exams' => $subjectMarks->map(function ($mark) {
                    return [
                        'exam'  => $mark->exam->name,
                        'score' => $mark->score,
                        'grade' => $mark->grade_label,
                    ];
                }),
            ];
        })->values();

        return response()->json([
            'student' => [
                'id'   => $student->id,
                'name' => $student->first_name . ' ' . $student->last_name,
            ],
            'academic_year_id' => $academicYearId,
            'term_id'          => $termId,
            'term_closed'      => $term->is_closed,
            'results'          => $results,
            'status'           => $term->is_closed
                ? 'final'
                : 'provisional',
        ]);
    }
}
