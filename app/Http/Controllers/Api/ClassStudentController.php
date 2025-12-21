<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassStudent;
use Illuminate\Http\Request;

class ClassStudentController extends Controller
{
    // GET /api/class-students
    public function index()
    {
        return ClassStudent::with(['student', 'schoolClass'])->get();
    }

    // POST /api/class-students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        // Ensure student is not enrolled twice
        ClassStudent::where('student_id', $validated['student_id'])->delete();

        return ClassStudent::create($validated);
    }

    // DELETE /api/class-students/{id}
    public function destroy($id)
    {
        ClassStudent::findOrFail($id)->delete();

        return response()->json(['message' => 'Student removed from class']);
    }
}
