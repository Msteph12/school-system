<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class GradeController extends Controller
{
    // GET /api/grades
    public function index()
    {
        return Grade::orderBy('order')->get();
    }


    // POST /api/grades
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:grades,name',
            'code' => 'required|string|unique:grades,code',
            'order' => 'required|integer|min:1',
        ]);

        return Grade::create($validated);
    }


    // GET /api/grades/{id}
    public function show($id)
    {
        return Grade::findOrFail($id);
    }

   // PUT /api/grades/{id}
    public function update(Request $request, $id)
    {
        if (Auth::user()->role->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

        $grade = Grade::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|unique:grades,name,' . $grade->id,
            'code' => 'string|unique:grades,code,' . $grade->id,
            'order' => 'integer|min:1',
        ]);

        $grade->update($validated);

        return $grade;
    }

    // DELETE /api/grades/{id}
    public function destroy($id)
    {
        return response()->json([
            'message' => 'Grades cannot be deleted once created'
        ], 403);
    }
}
