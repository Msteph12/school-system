<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubjectTeacher;
use Illuminate\Http\Request;

class SubjectTeacherController extends Controller
{
    // GET /api/subject-teachers
    public function index()
    {
        return SubjectTeacher::with(['teacher', 'subject'])->get();
    }

    // POST /api/subject-teachers
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'class_subject_id' => 'required|exists:subjects,id', 
        ]);

        // prevent duplicate assignment
        $exists = SubjectTeacher::where('teacher_id', $validated['teacher_id'])
            ->where('class_subject_id', $validated['class_subject_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Teacher already assigned to this subject'
            ], 409);
        }

        return SubjectTeacher::create($validated);
    }

    // DELETE /api/subject-teachers/{id}
    public function destroy($id)
    {
        SubjectTeacher::findOrFail($id)->delete();

        return response()->json(['message' => 'Teacher removed from subject']);
    }
}
