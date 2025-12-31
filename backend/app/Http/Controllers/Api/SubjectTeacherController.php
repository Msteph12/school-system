<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubjectTeacher;
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
            'class_subject_id' => 'required|exists:class_subjects,id',
        ]);

        $exists = SubjectTeacher::where('teacher_id', $validated['teacher_id'])
            ->where('class_subject_id', $validated['class_subject_id'])
            ->where('is_active', true)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Teacher already assigned to this subject'
            ], 409);
        }

        return SubjectTeacher::create([
            ...$validated,
            'is_active' => true
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
