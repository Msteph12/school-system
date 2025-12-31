<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
        'status',
    ];

    public function isClosed(): bool
    {
        return !$this->is_active || $this->status === 'closed';
    }

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

        public function isLocked()
    {
        return $this->status === 'locked';
    }

    /**
     * An academic year has many timetables.
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

}
