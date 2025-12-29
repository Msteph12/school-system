<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassStudent;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class StudentAttendanceController extends Controller
{
    public function index()
    {
        return response()->json(
            StudentAttendance::orderBy('id', 'desc')->get()
        );
    }

    // POST /api/student-attendance
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

        // Ensure class enrollment matches student + academic year
        $classStudent = ClassStudent::where('id', $validated['class_student_id'])
            ->where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->first();

        if (!$classStudent) {
            return response()->json([
                'message' => 'Invalid class enrollment for student'
            ], 422);
        }

        // Status-based date rules
        if ($validated['status'] === 'present') {
            $validated['from_date'] = null;
            $validated['to_date'] = null;
        }

        if (in_array($validated['status'], ['absent', 'excused']) && empty($validated['from_date'])) {
            return response()->json([
                'message' => 'Absent or excused attendance requires a date'
            ], 422);
        }

        // Prevent exact duplicate attendance entry
        $exists = StudentAttendance::where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('term_id', $validated['term_id'])
            ->where('from_date', $validated['from_date'])
            ->where('to_date', $validated['to_date'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Attendance already recorded for this period'
            ], 409);
        }

        return StudentAttendance::create($validated);
    }

    /**
     * NO HARD DELETE
     * Attendance records are historical and must never be deleted.
     */
}
