<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class TeacherAttendanceController extends Controller
{
    // POST /api/teacher-attendance
    public function store(Request $request)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'registrar'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,on_leave',
            'check_in_time' => 'nullable|date_format:H:i',
            'check_out_time' => 'nullable|date_format:H:i',
        ]);

        // Prevent duplicate attendance per teacher per day
        $exists = TeacherAttendance::where('teacher_id', $validated['teacher_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('date', $validated['date'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Attendance already recorded for this teacher on this date'
            ], 409);
        }

        // Status-based validation (admin-proof)
        if ($validated['status'] === 'present') {
            if (!$validated['check_in_time']) {
                return response()->json([
                    'message' => 'Check-in time is required when teacher is marked present'
                ], 422);
            }
        } else {
            // absent / on_leave → force no times
            $validated['check_in_time'] = null;
            $validated['check_out_time'] = null;
        }

        // Logical time order
        if (
            $validated['check_in_time'] &&
            $validated['check_out_time'] &&
            $validated['check_out_time'] <= $validated['check_in_time']
        ) {
            return response()->json([
                'message' => 'Check-out time must be after check-in time'
            ], 422);
        }

        return TeacherAttendance::create($validated);
    }

    /**
     * NO HARD DELETE
     * Attendance is historical and preserved.
     */
}
