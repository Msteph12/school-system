<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'class_id',
        'academic_year_id', 
        'status', // active, promoted, repeated, withdrawn
    ];

    
    /**
     * This enrollment belongs to one student.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * This enrollment belongs to one class.
     */
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * This enrollment belongs to one academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * This enrollment has many attendance records.
     */
    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }
}
