<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPromotion extends Model
{
    protected $fillable = [
        'student_id',
        'from_grade_id',
        'from_class_id',
        'to_grade_id',
        'to_class_id',
        'academic_year_id',
        'promoted_by',
        'promoted_at',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}

