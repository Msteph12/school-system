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

    protected $casts = [
        'promoted_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function fromGrade()
    {
        return $this->belongsTo(Grade::class, 'from_grade_id');
    }

    public function fromClass()
    {
        return $this->belongsTo(SchoolClass::class, 'from_class_id');
    }

    public function toGrade()
    {
        return $this->belongsTo(Grade::class, 'to_grade_id');
    }

    public function toClass()
    {
        return $this->belongsTo(SchoolClass::class, 'to_class_id');
    }

    public function promotedBy()
    {
        return $this->belongsTo(User::class, 'promoted_by');
    }
}