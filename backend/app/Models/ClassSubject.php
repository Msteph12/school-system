<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'subject_id',
    ];

    /**
     * This subject assignment belongs to one class.
     */
    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * This subject assignment belongs to one subject.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * A class subject can have many teachers over time.
     */
    public function subjectTeachers()
    {
        return $this->hasMany(SubjectTeacher::class);
    }
}
