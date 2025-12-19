<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubjectTeacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_subject_id',
        'teacher_id', // active, inactive
    ];

    /**
     * This teaching assignment belongs to a class subject.
     */
    public function classSubject()
    {
        return $this->belongsTo(ClassSubject::class);
    }

    /**
     * This teaching assignment belongs to a teacher.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
