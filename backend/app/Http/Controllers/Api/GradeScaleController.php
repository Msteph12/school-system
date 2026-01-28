<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeScale;
use Illuminate\Http\Request;

class GradeScaleController extends Controller
{
    /**
     * GET /api/grade-scales
     */
    public function index()
    {
        return response()->json(
            GradeScale::orderBy('name')->get()
        );
    }

    /**
     * POST /api/grade-scales
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:grade_scales,name',
            'description' => 'nullable|string',
            'is_active'   => 'required|boolean',
        ]);

        $gradeScale = GradeScale::create($data);

        return response()->json($gradeScale, 201);
    }

    /**
     * PUT /api/grade-scales/{id}
     */
    public function update(Request $request, $id)
    {
        $gradeScale = GradeScale::findOrFail($id);

        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:grade_scales,name,' . $gradeScale->id,
            'description' => 'nullable|string',
            'is_active'   => 'required|boolean',
        ]);

        $gradeScale->update($data);

        return response()->json($gradeScale);
    }

    /**
     * PATCH /api/grade-scales/{id}/toggle-status
     */
    public function toggleStatus($id)
    {
        $gradeScale = GradeScale::findOrFail($id);

        $gradeScale->update([
            'is_active' => ! $gradeScale->is_active,
        ]);

        return response()->json($gradeScale);
    }

    /**
     * DELETE /api/grade-scales/{id}
     */
    public function destroy($id)
    {
        $gradeScale = GradeScale::findOrFail($id);

        // Prevent deletion if used
        if (method_exists($gradeScale, 'marks') && $gradeScale->marks()->exists()) {
            return response()->json([
                'message' => 'Cannot delete grade scale already in use',
            ], 409);
        }

        $gradeScale->delete();

        return response()->noContent();
    }
}
