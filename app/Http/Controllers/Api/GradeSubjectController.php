<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeSubject;
use Illuminate\Http\Request;

class GradeSubjectController extends Controller
{
    // GET /api/grade-subjects
    public function index()
    {
        return GradeSubject::with(['grade', 'subject'])->get();
    }

    // POST /api/grade-subjects
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        // prevent duplicate subject assignment to same grade
        $exists = GradeSubject::where('grade_id', $validated['grade_id'])
            ->where('subject_id', $validated['subject_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Subject already assigned to this grade'
            ], 409);
        }

        return GradeSubject::create($validated);
    }

    // DELETE /api/grade-subjects/{id}
    public function destroy($id)
    {
        GradeSubject::findOrFail($id)->delete();

        return response()->json(['message' => 'Grade subject removed']);
    }
}
