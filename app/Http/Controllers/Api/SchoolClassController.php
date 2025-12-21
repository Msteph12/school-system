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
            'name' => 'string|unique:school_classes,name,' . $schoolClass->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $schoolClass->update($validated);

        return $schoolClass;
    }

    // DELETE /api/school-classes/{id}
    public function destroy($id)
    {
        SchoolClass::findOrFail($id)->delete();

        return response()->json(['message' => 'School class deleted']);
    }
}
