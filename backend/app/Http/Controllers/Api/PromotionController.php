<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PromotionService;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    protected PromotionService $promotionService;

    public function __construct(PromotionService $promotionService)
    {
        $this->promotionService = $promotionService;
    }

    /**
     * POST /api/promotions
     * Promote students from one academic year to another
     */
    public function promote(Request $request)
    {
        $validated = $request->validate([
            'from_academic_year_id' => 'required|exists:academic_years,id',
            'to_academic_year_id'   => 'required|exists:academic_years,id',
            'promoted_ids'          => 'array',
            'repeated_ids'          => 'array',
        ]);

        $this->promotionService->promoteStudents(
            $validated['from_academic_year_id'],
            $validated['to_academic_year_id'],
            $validated['promoted_ids'] ?? [],
            $validated['repeated_ids'] ?? [],
            $request->input('student_ids', [])
        );

        return response()->json([
            'message' => 'Students promoted successfully',
        ]);
    }
}
