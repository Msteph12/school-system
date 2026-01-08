<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTeacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'grade_id',
        'class_id',
        'academic_year_id',
        'is_active',
        'assigned_at',
        'unassigned_at',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
