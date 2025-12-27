<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use Illuminate\Http\Request;

class FeeStructureController extends Controller
{
    // GET /api/fee-structures
    public function index()
    {
        return FeeStructure::with(['schoolClass', 'academicYear', 'term'])->get();
    }

    // POST /api/fee-structures
    public function store(Request $request)
    {
        $data = $request->validate([
            'class_id' => 'required|exists:school_classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id' => 'required|exists:terms,id',
            'amount' => 'required|numeric|min:0',
        ]);

        return FeeStructure::create($data);
    }

    // PUT /api/fee-structures/{id}
    public function update(Request $request, $id)
    {
        $feeStructure = FeeStructure::findOrFail($id);

        $data = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $feeStructure->update($data);

        return $feeStructure;
    }
}
