<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marks extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_id',
        'subject_id',
        'academic_year_id',
        'term_id',

        'score',        // numeric mark, e.g. 78
        'grade_label',  // Excellent, Above Average, etc.
    ];

    // A mark belongs to a student
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // A mark belongs to an exam
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    // A mark belongs to a subject
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // A mark belongs to an academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // A mark belongs to a term
    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
