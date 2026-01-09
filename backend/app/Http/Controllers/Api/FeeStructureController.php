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
        return FeeStructure::with(['grade','term','academicYear'])
            ->get()
            ->map(fn ($f) => [
                'id' => $f->id,
                'grade' => $f->grade->name,
                'term' => $f->term->name,
                'academicYear' => $f->academicYear->name,
                'totalAmount' =>
                    $f->mandatory_amount +
                    collect($f->optional_fees)->sum('amount'),
            ]);
    }

    // POST /api/fee-structures
    public function store(Request $request)
    {
        $data = $request->validate([
        'grade_id' => 'required|exists:grades,id',
        'academic_year_id' => 'required|exists:academic_years,id',
        'term_id' => 'required|exists:terms,id',
        'mandatory_amount' => 'required|numeric|min:0',
        'optional_fees' => 'array',
        'payment_details' => 'array',
        'remarks' => 'nullable|string',
    ]);

        return FeeStructure::create($data);
    }

    // PUT /api/fee-structures/{id}
    public function update(Request $request, $id)
    {
        $feeStructure = FeeStructure::findOrFail($id);

        $data = $request->validate([
            'mandatory_amount' => 'required|numeric|min:0',
            'optional_fees' => 'array',
            'payment_details' => 'array',
            'remarks' => 'nullable|string',
        ]);

        $feeStructure->update($data);

        return $feeStructure;
    }

}
