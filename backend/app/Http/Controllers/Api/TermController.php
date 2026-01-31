<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TermController extends Controller
{
    // GET /api/terms
    public function index()
    {
        return Term::with('academicYear')
            ->orderBy('order')
            ->get()
            ->map(fn ($term) => $this->transformTerm($term));
    }

    // GET /api/terms/{id}
    public function show($id)
    {
        $term = Term::with('academicYear')->findOrFail($id);
        return $this->transformTerm($term);
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
        ]);

        return Term::create($validated);
    }

    // PUT /api/terms/{id}
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $term = Term::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $term->update($validated);

        return $this->transformTerm($term);
    }

    /**
     * POST /api/terms/{term}/lock
     * Lock a term (close it permanently)
     */
    public function lock(Term $term)
    {
        $this->authorizeAdmin();

        if ($term->is_closed) {
            return response()->json([
                'message' => 'Term is already locked.',
            ], 422); 
        }

        // Enforce sequential locking
        if ($term->order > 1) {
            $previous = Term::where('academic_year_id', $term->academic_year_id)
                ->where('order', $term->order - 1)
                ->first();

            if (!$previous || !$previous->is_closed) {
                return response()->json([
                    'message' => 'Previous term must be locked first.',
                ], 422);
            }
        }

        $term->update([
            'is_active' => false,
            'is_closed' => true,
        ]);

        return $this->transformTerm($term);
    }

    /**
     * POST /api/terms/{term}/unlock
     * Re-open a locked term (admin only)
     */
    public function unlock(Term $term)
    {
        $this->authorizeAdmin();

        if (!$term->is_closed) {
            return response()->json([
                'message' => 'Term is not locked.',
            ], 422);
        }

        DB::transaction(function () use ($term) {
            Term::where('academic_year_id', $term->academic_year_id)
                ->update(['is_active' => false]);

            $term->update([
                'is_closed' => false,
                'is_active' => true,
            ]);
        });

        return $this->transformTerm($term);
    }

    /**
     * -----------------------------------------
     * Helpers
     * -----------------------------------------
     */

    private function authorizeAdmin(): void
    {
        $user = Auth::user();

        if (!$user || !$user->role || $user->role->name !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    private function transformTerm(Term $term): array
    {
        return [
            'id' => (string) $term->id,
            'name' => $term->name,
            'order' => $term->order,

            // frontend contract
            'isLocked' => (bool) $term->is_closed,
            'lockedDate' => $term->is_closed ? $term->updated_at?->toISOString() : null,
            'lockedBy' => $term->is_closed ? optional(Auth::user())->name : null,

            // internal (optional but useful)
            'isActive' => $term->is_active,
        ];
    }

    public function activate($id)
    {
        $term = Term::findOrFail($id);

        if ($term->is_closed) {
            return response()->json([
                'message' => 'Cannot activate a locked term'
            ], 422);
        }

        // Deactivate all terms in same academic year
        Term::where('academic_year_id', $term->academic_year_id)
            ->update(['is_active' => false]);

        // Activate selected term
        $term->update(['is_active' => true]);

        return response()->json([
            'message' => 'Term activated successfully',
            'data' => $term
        ]);
    }

}
