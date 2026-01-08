<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassTeacher;
use Illuminate\Http\Request;

class ClassTeacherController extends Controller
{
    // GET /api/class-teachers
    public function index()
    {
        return ClassTeacher::with([
            'teacher',
            'grade',
            'class',
            'academicYear'
        ])->orderByDesc('assigned_at')->get();
    }

    // POST /api/class-teachers
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'grade_id' => 'required|exists:grades,id',
            'class_id' => 'required|exists:classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $exists = ClassTeacher::where([
            'grade_id' => $validated['grade_id'],
            'class_id' => $validated['class_id'],
            'academic_year_id' => $validated['academic_year_id'],
            'is_active' => true,
        ])->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This class already has an active class teacher'
            ], 409);
        }

        return ClassTeacher::create($validated);
    }

    // PATCH /api/class-teachers/{id}/unassign
    public function unassign($id)
    {
        $assignment = ClassTeacher::findOrFail($id);

        $assignment->update([
            'is_active' => false,
            'unassigned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Class teacher unassigned successfully'
        ]);
    }
}
