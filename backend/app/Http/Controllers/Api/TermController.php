<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            'order' => 'required|integer|min:1',
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

        $year = AcademicYear::findOrFail($validated['academic_year_id']);

        if ($year->isClosed()) {
            return response()->json([
                'message' => 'This academic year is closed. Terms cannot be created.',
            ], 423);
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
            'order' => 'nullable|integer|min:1',
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

    public function activate(Term $term)
    {
        DB::transaction(function () use ($term) {
            Term::where('academic_year_id', $term->academic_year_id)
                ->update(['is_active' => false]);

            $term->update(['is_active' => true]);
        });

        return response()->json([
            'message' => 'Term activated successfully',
            'term' => $term,
        ]);
    }

    public function close(Term $term)
    {
        if (!$term->is_active) {
            return response()->json([
                'message' => 'Only the active term can be closed',
            ], 422);
        }

        $term->update([
            'is_closed' => true,
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Term closed successfully',
            'term' => $term,
        ]);
    }

    /**
     * TERMS ARE NEVER DELETED
     * Terms are historical records tied to attendance, exams and results.
     * Use is_active to close a term instead.
     */

}
