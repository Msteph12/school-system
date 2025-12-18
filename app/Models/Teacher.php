<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'staff_number',
        'first_name',
        'last_name',
        'phone',
        'email',
        'department',
        'status',
    ];

    /**
     * A teacher can be a class teacher for many classes.
     */
    public function classes()
    {
        return $this->hasMany(SchoolClass::class, 'teacher_id');
    }

    /**
     * A teacher teaches many subjects in different classes.
     */
    public function subjectTeachers()
    {
        return $this->hasMany(SubjectTeacher::class);
    }
}
