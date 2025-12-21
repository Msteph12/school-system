<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    // GET /api/school-classes
    public function index()
    {
        return SchoolClass::orderBy('name')->get();
    }

    // POST /api/school-classes
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:school_classes,name',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        return SchoolClass::create($validated);
    }

    // GET /api/school-classes/{id}
    public function show($id)
    {
        return SchoolClass::findOrFail($id);
    }

    // PUT /api/school-classes/{id}
    public function update(Request $request, $id)
    {
        $schoolClass = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'grade_id' => 'exists:grades,id',
            'name' => 'string',
            'code' => 'nullable|string',
            'status' => 'in:active,inactive',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'nullable|integer|min:1',
        ]);

        // Ensure class name is unique per grade
        if (isset($validated['name'], $validated['grade_id'])) {
            $exists = SchoolClass::where('grade_id', $validated['grade_id'])
                ->where('name', $validated['name'])
                ->where('id', '!=', $schoolClass->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Class name already exists in this grade'
                ], 409);
            }
        }

        $schoolClass->update($validated);

        return $schoolClass;
    }


    // DELETE /api/school-classes/{id}
    public function destroy($id)
    {
        $schoolClass = SchoolClass::findOrFail($id);

        // Prevent deletion if students are assigned
        if ($schoolClass->classStudents()->exists()) {
            return response()->json([
                'message' => 'Cannot delete class with enrolled students'
            ], 409);
        }

        $schoolClass->delete();

        return response()->json(['message' => 'School class deleted']);
    }
}
