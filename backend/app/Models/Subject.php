<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * A subject is assigned to many classes (via class_subjects).
     */
    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }

    /**
     * A subject is taught in many classes (many-to-many).
     */
    public function classes()
    {
        return $this->belongsToMany(
            SchoolClass::class,
            'class_subjects'
        );
    }

    /**
     * A subject can be part of many grades (via grade_subjects).
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

}
