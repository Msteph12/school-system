<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'academic_year_id',
        'term_id',

        'amount_paid',
        'payment_date',
        'payment_method',
        'reference',

        'receipt_number',
        'receipt_generated_at',
    ];

    // Payment belongs to a student
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // Payment belongs to an academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // Payment belongs to a term
    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
