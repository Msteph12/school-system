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
            'fromGrade:id,name',
            'fromClass:id,name',
            'toGrade:id,name',
            'toClass:id,name',
        ])
        ->orderByDesc('promoted_at')
        ->get()
        ->map(fn ($p) => [
            'id' => $p->id,
            'student_name' => $p->student->first_name . ' ' . $p->student->last_name,
            'from_grade' => $p->fromGrade->name,
            'from_class' => $p->fromClass->name,
            'to_grade' => $p->toGrade->name,
            'to_class' => $p->toClass->name,
            'academic_year' => $p->academicYear->name,
            'promoted_at' => $p->promoted_at->format('Y-m-d'),
        ]);

        return response()->json($history);
    }
}
