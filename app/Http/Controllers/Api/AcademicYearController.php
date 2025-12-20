<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    // GET /api/academic-years
    public function index()
    {
        return AcademicYear::orderBy('start_date', 'desc')->get();
    }

    // POST /api/academic-years
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean'
        ]);

        // Optional: ensure only one active academic year
        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        return AcademicYear::create($validated);
    }

    // GET /api/academic-years/{id}
    public function show($id)
    {
        return AcademicYear::findOrFail($id);
    }

    // PUT /api/academic-years/{id}
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'is_active' => 'boolean'
        ]);

        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $academicYear->update($validated);

        return $academicYear;
    }

    // DELETE /api/academic-years/{id}
    public function destroy($id)
    {
        AcademicYear::findOrFail($id)->delete();

        return response()->json(['message' => 'Academic year deleted']);
    }
}
