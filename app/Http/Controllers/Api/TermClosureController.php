<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TermClosureController extends Controller
{
    /**
     * POST /api/terms/{term}/close
     * Close a term (lock marks, exams, attendance)
     */
    public function close(Request $request, Term $term)
    {

        // 1. Prevent double-closing
        if ($term->is_closed) {
            return response()->json([
                'message' => 'This term is already closed.',
            ], 422);
        }

        // 2. Close the term
        $term->update([
            'is_active' => false,
            'is_closed' => true,
        ]);

        return response()->json([
            'message' => 'Term closed successfully. Marks and exams are now locked.',
            'term' => $term,
        ]);
    }
}
