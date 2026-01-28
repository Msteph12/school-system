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
        $classes = SchoolClass::with('grade')
            ->orderBy('grade_id')
            ->orderBy('display_order')
            ->get()
            ->map(function ($class) {
                return [
                    'id' => (string) $class->id,
                    'name' => $class->name,
                    'code' => $class->code,
                    'display_order' => $class->display_order,
                    'status' => ucfirst($class->status),
                    'gradeId' => (string) $class->grade_id,
                    'gradeName' => $class->grade?->name,
                ];
            });

        return response()->json(['classes' => $classes]);
    }

    // POST /api/school-classes
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'name' => 'required|string',
            'code' => 'nullable|string',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);

        // Ensure unique class name per grade
        $exists = SchoolClass::where('grade_id', $validated['grade_id'])
            ->where('name', $validated['name'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Class name already exists in this grade'
            ], 409);
        }

        $class = SchoolClass::create([
            ...$validated,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Class created successfully',
            'class' => $class
        ], 201);
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
            'grade_id' => 'sometimes|exists:grades,id',
            'name' => 'sometimes|string',
            'code' => 'nullable|string',
            'status' => 'in:active,inactive',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'nullable|integer|min:1',
            'display_order' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        // Unique name per grade (on update)
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

        return response()->json([
            'message' => 'Class updated successfully',
            'class' => $schoolClass
        ]);
    }

    // DELETE /api/school-classes/{id} (SOFT DELETE)
    public function destroy($id)
    {
        $schoolClass = SchoolClass::findOrFail($id);

        $schoolClass->update([
            'status' => 'inactive'
        ]);

        return response()->json([
            'message' => 'Class archived (inactive)'
        ]);
    }

    public function toggleStatus($id)
    {
        $class = SchoolClass::findOrFail($id);

        $class->update([
            'status' => $class->status === 'active' ? 'inactive' : 'active'
        ]);

        return response()->json(['status' => $class->status]);
    }
}
