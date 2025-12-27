<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OptionalFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'grade_id',
        'academic_year_id',
        'term_id',
        'amount',
        'is_active',
    ];

    /**
     * Relationships
     */

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    // Students who selected this optional fee
    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'student_optional_fees'
        )->withPivot('academic_year_id', 'term_id')
        ->withTimestamps();
    }

}
