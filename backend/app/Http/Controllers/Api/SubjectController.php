<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SubjectController extends Controller
{
    // GET /api/subjects
    public function index()
    {
        return Subject::orderBy('name')->get();
    }

    // POST /api/subjects
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|unique:subjects,name',
            'code' => 'nullable|string|unique:subjects,code',
        ]);

        return Subject::create($validated);
    }

    // GET /api/subjects/{id}
    public function show($id)
    {
        return Subject::findOrFail($id);
    }

    // PUT /api/subjects/{id}
    public function update(Request $request, $id)
    {

        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|unique:subjects,name,' . $subject->id,
            'code' => 'nullable|string|unique:subjects,code,' . $subject->id,
        ]);

        $subject->update($validated);

        return $subject;
    }

    // DELETE /api/subjects/{id}
    public function destroy($id)
    {   
        return response()->json([
            'message' => 'Subjects cannot be deleted once created'
        ], 403);
    }
}
