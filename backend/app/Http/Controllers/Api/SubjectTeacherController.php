<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubjectTeacher;
use App\Models\ClassSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SubjectTeacherController extends Controller
{
    // GET /api/subject-teachers
    public function index()
    {
        return SubjectTeacher::with(['teacher', 'classSubject'])
            ->where('is_active', true)
            ->get();
    }

    // POST /api/subject-teachers
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'grade_id' => 'required|exists:grades,id',
            'subject_id' => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        // Resolve or create class_subject
        $classSubject = ClassSubject::firstOrCreate([
            'grade_id' => $validated['grade_id'],
            'subject_id' => $validated['subject_id'],
            'academic_year_id' => $validated['academic_year_id'],
        ]);

        $exists = SubjectTeacher::where('teacher_id', $validated['teacher_id'])
            ->where('class_subject_id', $classSubject->id)
            ->where('is_active', true)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already assigned'], 409);
        }

        return SubjectTeacher::create([
            'teacher_id' => $validated['teacher_id'],
            'class_subject_id' => $classSubject->id,
            'is_active' => true,
        ]);
    }

    // DELETE /api/subject-teachers/{id}
    public function destroy($id)
    {
        
        $assignment = SubjectTeacher::findOrFail($id);

        $assignment->update([
            'is_active' => false
        ]);

        return response()->json([
            'message' => 'Teacher unassigned from subject'
        ]);
    }
}
