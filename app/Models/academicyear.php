<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    /**
     * An academic year has many terms.
     */
    public function terms()
    {
        return $this->hasMany(Term::class);
    }

    /**
     * An academic year has many class-student enrollments.
     */
    public function classStudents()
    {
        return $this->hasMany(ClassStudent::class);
    }
}
