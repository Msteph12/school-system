<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\StudentPromotion;
use Illuminate\Http\Request;

class PromotionHistoryController extends Controller
{
    /**
     * GET /api/promotions/history
     */
    public function index()
    {
        $history = StudentPromotion::with([
            'student:id,first_name,last_name',
            'academicYear:id,name',
        ])
        ->orderByDesc('promoted_at')
        ->get()
        ->map(fn ($p) => [
            'id' => $p->id,
            'student_name' => $p->student->first_name . ' ' . $p->student->last_name,
            'from_grade' => Grade::find($p->from_grade_id)->name,
            'from_class' => SchoolClass::find($p->from_class_id)->name,
            'to_grade' => Grade::find($p->to_grade_id)->name,
            'to_class' => SchoolClass::find($p->to_class_id)->name,
            'academic_year' => $p->academicYear->name,
            'promoted_at' => $p->promoted_at->format('Y-m-d'),
        ]);

        return response()->json($history);
    }
}
