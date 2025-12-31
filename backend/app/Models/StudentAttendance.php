<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'class_student_id',
        'academic_year_id',
        'term_id',
        'status',
        'reason',
        'from_date',
        'to_date',
        'remarks',
    ];

    /* ================= Relationships ================= */

    // Attendance belongs to a student
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // Attendance belongs to a specific enrollment (class + year)
    public function classStudent()
    {
        return $this->belongsTo(ClassStudent::class);
    }

    // Attendance belongs to an academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // Attendance belongs to a term
    public function term()
    {
        return $this->belongsTo(Term::class);
    }
}
