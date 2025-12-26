<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassStudent;
use App\Models\StudentAttendance;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ReportsController extends Controller
{
    /**
     * Students per class for an academic year
     * GET /api/reports/students-by-class?academic_year_id=1
     */
    public function studentsByClass(Request $request)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'teacher', 'registrar'])) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        return ClassStudent::with(['student', 'schoolClass.grade'])
            ->where('academic_year_id', $request->academic_year_id)
            ->get()
            ->groupBy(fn ($item) =>
                $item->schoolClass->grade->name . ' - ' . $item->schoolClass->name
            );
    }

    /**
     * Student attendance summary
     * GET /api/reports/student-attendance?student_id=1
     */
    public function studentAttendance(Request $request)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'teacher', 'registrar'])) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        return StudentAttendance::where('student_id', $request->student_id)
            ->orderBy('from_date', 'desc')
            ->get();
    }

    /**
     * Teacher attendance summary
     * GET /api/reports/teacher-attendance?teacher_id=1
     */
    public function teacherAttendance(Request $request)
    {
        if (!in_array(Auth::user()->role->name, ['admin', 'teacher', 'registrar'])) {
        return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
        ]);

        return TeacherAttendance::where('teacher_id', $request->teacher_id)
            ->orderBy('date', 'desc')
            ->get();
    }
}
