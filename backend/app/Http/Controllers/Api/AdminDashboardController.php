<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Grade;
use App\Models\Timetable;
use App\Models\TeacherAttendance;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Basic counts
        $studentsCount = Student::count();
        $teachersCount = Teacher::count();
        $gradesCount   = Grade::count();

        // Students with balances (balance > 0)
        $studentsWithBalances = Student::where('balance', '>', 0)->count();

        // Timetable stats
        $publishedTimetables = Timetable::where('is_published', true)->count();
        $totalClasses        = Grade::count();

        // Teacher attendance (today)
        $today = Carbon::today();

        $teachersPresentToday = TeacherAttendance::whereDate('date', $today)
            ->where('status', 'present')
            ->distinct('teacher_id')
            ->count('teacher_id');

        return response()->json([
            'students' => $studentsCount,
            'teachers' => $teachersCount,
            'grades'   => $gradesCount,

            'studentsWithBalances' => $studentsWithBalances,

            'timetable' => [
                'published' => $publishedTimetables,
                'total'     => $totalClasses,
            ],

            'teacherAttendance' => [
                'present' => $teachersPresentToday,
                'total'   => $teachersCount,
            ],
        ]);
    }
}
