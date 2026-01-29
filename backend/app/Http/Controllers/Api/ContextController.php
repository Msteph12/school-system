<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Term;

class ContextController extends Controller
{
    /**
     * GET /api/context/current
     */
    public function current()
    {
        $academicYear = AcademicYear::where('is_active', true)->first();
        $term = Term::where('is_active', true)->first();

        return response()->json([
            'academicYear' => $academicYear ? [
                'id' => $academicYear->id,
                'name' => $academicYear->name,
            ] : null,

            'term' => $term ? [
                'id' => $term->id,
                'name' => $term->name,
                'order' => $term->order,
                'isLocked' => $term->is_locked,
            ] : null,
        ]);
    }
}
