<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use App\Models\ExamType;
use Illuminate\Http\Request;

class ExamTypeController extends Controller
{
    public function index()
    {
        return ExamType::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:exam_types,name',
        ]);

        return ExamType::create($validated);
    }

    public function update(Request $request, $id)
    {
        $examType = ExamType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:exam_types,name,' . $examType->id,
        ]);

        $examType->update($validated);

        return $examType;
    }

    public function destroy($id)
    {
        ExamType::findOrFail($id)->delete();

        return response()->noContent();
    }
}
