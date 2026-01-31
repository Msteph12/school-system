<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * GET /api/students
     * Used by students table list
     */
    public function index()
    {
        return Student::with(['grade', 'class'])
            ->orderBy('last_name')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'admission_number' => $s->admission_number,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'name' => $s->first_name . ' ' . $s->last_name,
                    'gender' => $s->gender,
                    'status' => $s->status,
                    'is_promoted' => (bool) $s->is_promoted,
                    'grade' => $s->grade?->name,
                    'class' => $s->class?->name,
                ];
            });
    }

    /**
     * GET /api/students/by-admission/{admissionNo}
     * Used when searching student by admission number
     */
    public function findByAdmission($admissionNo)
    {
        $student = Student::with(['grade', 'class'])
            ->where('admission_number', $admissionNo)
            ->firstOrFail();

        return [
            'id' => $student->id,
            'admission_number' => $student->admission_number,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'name' => $student->first_name . ' ' . $student->last_name,
            'gender' => $student->gender,
            'status' => $student->status,
            'grade' => $student->grade?->name,
            'class' => $student->class?->name,
        ];
    }

    /**
     * POST /api/students
     * Used by Add Student Modal
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'admission_number' => 'required|string|unique:students,admission_number',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'status' => 'required|in:active,graduated,withdrawn,suspended',
            'guardian_name' => 'nullable|string',
            'guardian_relationship' => 'nullable|string',
            'guardian_phone' => 'nullable|string',
            'guardian_phone_alt' => 'nullable|string',
            'guardian_address' => 'nullable|string',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    /**
     * GET /api/students/{id}
     */
    public function show($id)
    {
        return Student::with(['grade', 'class'])->findOrFail($id);
    }

    /**
     * PUT /api/students/{id}
     */
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'admission_number' => 'string|unique:students,admission_number,' . $student->id,
            'first_name' => 'string',
            'last_name' => 'string',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'status' => 'in:active,graduated,withdrawn,suspended',
            'guardian_name' => 'nullable|string',
            'guardian_relationship' => 'nullable|string',
            'guardian_phone' => 'nullable|string',
            'guardian_phone_alt' => 'nullable|string',
            'guardian_address' => 'nullable|string',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ]);
    }

    /**
     * DELETE /api/students/{id}
     * Soft action (withdraw)
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);

        $student->update([
            'status' => 'withdrawn'
        ]);

        return response()->json([
            'message' => 'Student marked as withdrawn'
        ]);
    }
}
