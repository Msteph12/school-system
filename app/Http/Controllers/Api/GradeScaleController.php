<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeScale;
use Illuminate\Http\Request;

class GradeScaleController extends Controller
{
    /**
     * GET /api/grade-scales
     * List all grade descriptors
     */
    public function index()
    {
        return GradeScale::orderBy('name')->get();
    }

    /**
     * POST /api/grade-scales
     * Create a new grade descriptor
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:grade_scales,name',
            'description' => 'nullable|string',
        ]);

        $gradeScale = GradeScale::create($data);

        return response()->json([
            'message' => 'Grade scale created successfully',
            'data'    => $gradeScale,
        ], 201);
    }

    /**
     * GET /api/grade-scales/{gradeScale}
     * Show a single descriptor
     */
    public function show(GradeScale $gradeScale)
    {
        return $gradeScale;
    }

    /**
     * PUT /api/grade-scales/{gradeScale}
     * Update a descriptor
     */
    public function update(Request $request, GradeScale $gradeScale)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:grade_scales,name,' . $gradeScale->id,
            'description' => 'nullable|string',
        ]);

        $gradeScale->update($data);

        return response()->json([
            'message' => 'Grade scale updated successfully',
            'data'    => $gradeScale,
        ]);
    }

    /**
     * DELETE /api/grade-scales/{gradeScale}
     * Remove a descriptor
     */
    public function destroy(GradeScale $gradeScale)
    {
        // Safety check: prevent deletion if already used
        if ($gradeScale->marks()->exists()) {
            return response()->json([
                'message' => 'Cannot delete grade scale already in use',
            ], 409);
        }

        $gradeScale->delete();

        return response()->json([
            'message' => 'Grade scale deleted successfully',
        ]);
    }
}
