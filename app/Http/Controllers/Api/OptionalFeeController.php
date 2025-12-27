<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OptionalFee;
use Illuminate\Http\Request;

class OptionalFeeController extends Controller
{
    /**
     * GET /api/optional-fees
     * List optional fees (filterable)
     */
    public function index(Request $request)
    {
        $fees = OptionalFee::query()
            ->when($request->grade_id, fn ($q) =>
                $q->where('grade_id', $request->grade_id)
            )
            ->when($request->academic_year_id, fn ($q) =>
                $q->where('academic_year_id', $request->academic_year_id)
            )
            ->when($request->term_id, fn ($q) =>
                $q->where('term_id', $request->term_id)
            )
            ->get();

        return response()->json($fees);
    }

    /**
     * POST /api/optional-fees
     * Create optional fee
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'grade_id' => 'required|exists:grades,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id' => 'required|exists:terms,id',
            'amount' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $fee = OptionalFee::create($data);

        return response()->json($fee, 201);
    }

    /**
     * PUT /api/optional-fees/{id}
     * Update optional fee price or status
     */
    public function update(Request $request, $id)
    {
        $fee = OptionalFee::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $fee->update($data);

        return response()->json($fee);
    }

    /**
     * DELETE /api/optional-fees/{id}
     * Soft-remove by disabling
     */
    public function destroy($id)
    {
        $fee = OptionalFee::findOrFail($id);
        $fee->update(['is_active' => false]);

        return response()->json([
            'message' => 'Optional fee disabled'
        ]);
    }
}
