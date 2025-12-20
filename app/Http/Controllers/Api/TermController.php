<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class TermController extends Controller
{
    // GET /api/terms
    public function index()
    {
        return Term::with('academicYear')
            ->orderBy('start_date')
            ->get();
    }

    // POST /api/terms
    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Only one active term per academic year
        if (!empty($validated['is_active']) && $validated['is_active']) {
            Term::where('academic_year_id', $validated['academic_year_id'])
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        return Term::create($validated);
    }

    // GET /api/terms/{id}
    public function show($id)
    {
        return Term::with('academicYear')->findOrFail($id);
    }

    // PUT /api/terms/{id}
    public function update(Request $request, $id)
    {
        $term = Term::findOrFail($id);

        $validated = $request->validate([
            'academic_year_id' => 'exists:academic_years,id',
            'name' => 'string',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Enforce one active term per academic year
        if (!empty($validated['is_active']) && $validated['is_active']) {
            Term::where('academic_year_id', $term->academic_year_id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $term->update($validated);

        return $term;
    }

    // DELETE /api/terms/{id}
    public function destroy($id)
    {
        Term::findOrFail($id)->delete();

        return response()->json(['message' => 'Term deleted']);
    }
}
