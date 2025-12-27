<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admission_number',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'status',
        'guardian_name',
        'guardian_relationship',
        'guardian_phone',
        'guardian_phone_alt',
        'guardian_address',
    ];

    /**
     * A student has many class enrollments (over years).
     */
    public function classStudents()
    {
        return $this->hasMany(ClassStudent::class);
    }

    /**
     * A student has many attendance records.
     */
    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }

    /**
     * A student has many marks (exam performance).
     */
    public function marks()
    {
        return $this->hasMany(Marks::class);
    }

    /**
     * A student has many fee obligations.
     */
    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }

    /**
     * A student has made many payments.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Optional fees selected by the student
    public function optionalFees()
    {
        return $this->belongsToMany(
            OptionalFee::class,
            'student_optional_fees'
        )->withPivot('academic_year_id', 'term_id')
        ->withTimestamps();
    }
}
