<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id',
        'name',      // e.g. A, B, Blue
        'code',
        'status',
        'teacher_id',
        'capacity',
    ];

    /**
     * A class belongs to one grade.
     */
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    /**
     * A class has one class teacher.
     */
    public function classTeacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    /**
     * A class has many student enrollments.
     */
    public function classStudents()
    {
        return $this->hasMany(ClassStudent::class);
    }

    /**
     * A class has many subject assignments.
     */
    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }
}
