<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
    'grade_id',
    'academic_year_id',
    'term_id',
    'mandatory_amount',
    'optional_fees',
    'payment_details',
    'remarks',
    ];

    protected $casts = [
    'optional_fees' => 'array',
    'payment_details' => 'array',
    ];

    // Fee structure belongs to a grade
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    // Fee structure belongs to an academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // Fee structure belongs to a term
    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    // Fee structure applies to many students (through student fees)
    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }
}
