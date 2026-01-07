<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassStudent;
use App\Models\Student;
use App\Models\StudentAttendance;
use App\Models\AcademicYear;
use App\Models\Term;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    public function index()
    {
        return StudentAttendance::with(['student', 'classStudent.class'])
            ->orderByDesc('id')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admission_number' => 'required|string|exists:students,admission_number',
            'grade_id' => 'required|exists:grades,id',
            'class_id' => 'required|exists:classes,id',
            'status' => 'required|in:reported,present,sent_home,returned,withdrawn',
            'from_date' => 'required|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'reason' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $student = Student::where('admission_number', $validated['admission_number'])->first();

        $classStudent = ClassStudent::where('student_id', $student->id)
            ->where('class_id', $validated['class_id'])
            ->first();

            $academicYear = AcademicYear::where('is_active', true)->first();
            $term = Term::where('is_active', true)->first();

        if (!$academicYear || !$term) {
            return response()->json([
                'message' => 'Active academic year or term not set'
            ], 422);
        }

        if (!$classStudent) {
            return response()->json([
                'message' => 'Student not enrolled in selected class'
            ], 422);
        }

        return StudentAttendance::create([
            'student_id' => $student->id,
            'class_student_id' => $classStudent->id,
            'academic_year_id' => $academicYear->id,
            'term_id' => $term->id,
            'status' => $validated['status'],
            'from_date' => $validated['from_date'],
            'to_date' => $validated['to_date'],
            'reason' => $validated['reason'] ?? null,
            'remarks' => $validated['remarks'] ?? null,
        ]);
    }
}
