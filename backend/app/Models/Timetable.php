<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'subject_id',
        'teacher_id',
        'academic_year_id',
        'date',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'is_published',
    ];

    /**
     * Timetable belongs to a class
     */
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Timetable belongs to a subject
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Timetable belongs to a teacher
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Timetable belongs to an academic year
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
