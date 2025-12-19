<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'academic_year_id',
        'term_id',
        'amount',
    ];

    // Fee structure belongs to a class
    public function class()
    {
        return $this->belongsTo(SchoolClass::class);
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
