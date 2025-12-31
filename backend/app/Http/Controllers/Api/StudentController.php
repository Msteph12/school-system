<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // GET /api/students
    public function index()
    {
        return Student::select([
            'id',
            'first_name', 
            'last_name',
            'admission_number',
            'is_promoted'
        ])
        ->orderBy('last_name')
        ->get()
        ->map(fn($s) => [
            'id' => $s->id,
            'name' => $s->first_name . ' ' . $s->last_name,
            'is_promoted' => $s->is_promoted,
        ]);
    }

    // POST /api/students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'admission_number' => 'required|string|unique:students,admission_number',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'status' => 'required|string', // e.g. active, inactive
            'guardian_name' => 'nullable|string',
            'guardian_relationship' => 'nullable|string',
            'guardian_phone' => 'nullable|string',
            'guardian_phone_alt' => 'nullable|string',
            'guardian_address' => 'nullable|string',
        ]);

        return Student::create($validated);
    }

    // GET /api/students/{id}
    public function show($id)
    {
        return Student::findOrFail($id);
    }

    // PUT /api/students/{id}
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

        return $student;
    }

    // DELETE /api/students/{id}
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
