<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;

class TeacherAttendanceController extends Controller
{
   public function store(Request $request)
{
    $validated = $request->validate([
        'teacher_id' => 'required|exists:teachers,id',
        'academic_year_id' => 'required|exists:academic_years,id',
        'date' => 'required|date',
        'status' => 'required|in:present,absent,on_leave',
        'check_in_time' => 'nullable|date_format:H:i',
        'check_out_time' => 'nullable|date_format:H:i',
    ]);

    // prevent duplicate attendance
    $exists = TeacherAttendance::where('teacher_id', $validated['teacher_id'])
        ->where('academic_year_id', $validated['academic_year_id'])
        ->where('date', $validated['date'])
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Attendance already recorded for this teacher on this date'
        ], 409);
    }

    // logical time validation
    if (
        isset($validated['check_in_time'], $validated['check_out_time']) &&
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
     * Teacher attendance is historical and must be preserved.
     */
}
