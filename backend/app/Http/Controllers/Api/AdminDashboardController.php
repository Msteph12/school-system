<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

// Models (only used if tables exist)
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Grade;
use App\Models\Timetable;
use App\Models\TeacherAttendance;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // -----------------------------
        // SAFE COUNTS (no crashes)
        // -----------------------------
        $studentsCount = Schema::hasTable('students')
            ? Student::count()
            : 0;

        $teachersCount = Schema::hasTable('teachers')
            ? Teacher::count()
            : 0;

        $gradesCount = Schema::hasTable('grades')
            ? Grade::count()
            : 0;

        // -----------------------------
        // STUDENT BALANCES (optional column)
        // -----------------------------
        $studentsWithBalances = 0;
        if (
            Schema::hasTable('students') &&
            Schema::hasColumn('students', 'balance')
        ) {
            $studentsWithBalances = Student::where('balance', '>', 0)->count();
        }

        // -----------------------------
        // TIMETABLE STATS
        // -----------------------------
        $publishedTimetables = 0;
        if (
            Schema::hasTable('timetables') &&
            Schema::hasColumn('timetables', 'is_published')
        ) {
            $publishedTimetables = Timetable::where('is_published', true)->count();
        }

        // -----------------------------
        // TEACHER ATTENDANCE (today)
        // -----------------------------
        $teachersPresentToday = 0;
        if (
            Schema::hasTable('teacher_attendance') &&
            Schema::hasColumn('teacher_attendance', 'date')
        ) {
            $teachersPresentToday = TeacherAttendance::whereDate(
                'date',
                Carbon::today()
            )
                ->where('status', 'present')
                ->distinct('teacher_id')
                ->count('teacher_id');
        }

        // -----------------------------
        // RESPONSE (matches frontend)
        // -----------------------------
        return response()->json([
            'students' => $studentsCount,
            'teachers' => $teachersCount,
            'grades'   => $gradesCount,

            'studentsWithBalances' => $studentsWithBalances,

            'timetable' => [
                'published' => $publishedTimetables,
                'total'     => $gradesCount,
            ],

            'teacherAttendance' => [
                'present' => $teachersPresentToday,
                'total'   => $teachersCount,
            ],
        ]);
    }
}
