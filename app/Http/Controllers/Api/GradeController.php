<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    // GET /api/grades
    public function index()
    {
        return Grade::orderBy('name')->get();
    }

    // POST /api/grades
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:grades,name',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        return Grade::create($validated);
    }

    // GET /api/grades/{id}
    public function show($id)
    {
        return Grade::findOrFail($id);
    }

    // PUT /api/grades/{id}
    public function update(Request $request, $id)
    {
        $grade = Grade::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|unique:grades,name,' . $grade->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $grade->update($validated);

        return $grade;
    }

    // DELETE /api/grades/{id}
    public function destroy($id)
    {
        Grade::findOrFail($id)->delete();

        return response()->json(['message' => 'Grade deleted']);
    }
}
