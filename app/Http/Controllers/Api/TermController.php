<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        if (Auth::user()->role->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'is_closed' => 'boolean',
        ]);

        // Ensure only one active term per academic year
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
        if (Auth::user()->role->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    
        $term = Term::findOrFail($id);

        $validated = $request->validate([
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'name' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'nullable|boolean',
            'is_closed' => 'nullable|boolean',
        ]);

        // Determine which academic year to apply the active-term rule to
        $yearId = $validated['academic_year_id'] ?? $term->academic_year_id;

        if (!empty($validated['is_active']) && $validated['is_active']) {
            Term::where('academic_year_id', $yearId)
                ->where('is_active', true)
                ->where('id', '!=', $term->id)
                ->update(['is_active' => false, 'is_closed' => false]);
        }

        $term->update($validated);

        return $term;
    }

    /**
     * TERMS ARE NEVER DELETED
     * Terms are historical records tied to attendance, exams and results.
     * Use is_active to close a term instead.
     */

}
