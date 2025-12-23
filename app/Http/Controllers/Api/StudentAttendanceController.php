<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassStudent;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_student_id' => 'required|exists:class_students,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id' => 'required|exists:terms,id',
            'status' => 'required|in:present,absent,excused',
            'reason' => 'nullable|string',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'remarks' => 'nullable|string',
        ]);

        // ensure class_student matches student + year
        $classStudent = ClassStudent::where('id', $validated['class_student_id'])
            ->where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->first();

        if (!$classStudent) {
            return response()->json([
                'message' => 'Invalid class enrollment for student'
            ], 422);
        }

        // prevent duplicates
        $exists = StudentAttendance::where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('term_id', $validated['term_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Attendance already recorded for this term'
            ], 409);
        }

        return StudentAttendance::create($validated);
    }

    /**
     * NO HARD DELETE
     * Attendance records are never deleted.
     * If needed, update status instead.
     */
}

