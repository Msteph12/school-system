<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',                // Midterm, Endterm, CAT 1, etc.
        'class_id',
        'subject_id',
        'academic_year_id',
        'term_id',
        'exam_type_id',
        'exam_date',
        'total_marks',
        'status',
        'attachment',
    ];

    // An exam belongs to a class
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    // An exam belongs to a subject
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // An exam belongs to an academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // An exam belongs to a term
    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    // An exam has many marks
    public function marks()
    {
        return $this->hasMany(Marks::class);
    }

    // An exam belongs to an exam type
    public function examType()
    {
        return $this->belongsTo(ExamType::class);
    }
}
