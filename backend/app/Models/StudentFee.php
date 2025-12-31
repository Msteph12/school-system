<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'fee_structure_id',
        'amount_due',
    ];

    // Student fee belongs to a student
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // Student fee belongs to a fee structure
    public function feeStructure()
    {
        return $this->belongsTo(FeeStructure::class);
    }
}
