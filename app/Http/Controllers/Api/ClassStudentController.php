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
            'class_id' => 'required|exists:school_classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        // Ensure student is not enrolled twice
        $exists = ClassStudent::where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Student is already enrolled for this academic year'
            ], 409);
        }

        return ClassStudent::create($validated);
    }

    // DELETE /api/class-students/{id}
    public function destroy($id)
    {
        ClassStudent::findOrFail($id)->delete();

        return response()->json(['message' => 'Student removed from class']);
    }
}
