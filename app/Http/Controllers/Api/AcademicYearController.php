<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AcademicYearController extends Controller
{
    // GET /api/academic-years
    public function index()
    {
        return AcademicYear::orderBy('start_date', 'desc')->get();
    }

    // POST /api/academic-years
    public function store(Request $request)
    {
        if (Auth::user()->role?->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

        $validated = $request->validate([
            'name' => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'status' => 'required|in:planned,active,closed',
        ]);

        // Ensure only one active academic year
        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        if ($validated['status'] === 'closed') {
            $validated['is_active'] = false;
        }

        if ($validated['status'] === 'active') {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
            $validated['is_active'] = true;
        }

        return AcademicYear::create($validated);
    }

    // GET /api/academic-years/{id}
    public function show($id)
    {
        return AcademicYear::findOrFail($id);
    }

    // PUT /api/academic-years/{id}
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        if (Auth::user()->role->name !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    
        $validated = $request->validate([
            'name' => 'string|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'is_active' => 'boolean',
            'status' => 'in:planned,active,closed',
        ]);

        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        if ($validated['status'] === 'closed') {
            $validated['is_active'] = false;
        }

        if ($validated['status'] === 'active') {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
            $validated['is_active'] = true;
        }

        $academicYear->update($validated);

        return $academicYear;
    }
}
