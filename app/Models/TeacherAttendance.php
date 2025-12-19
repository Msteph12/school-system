<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'academic_year_id',
        'date',
        'status',
        'check_in_time',
        'check_out_time',
    ];

    /**
     * A teacher attendance belongs to a teacher
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * A teacher attendance belongs to an academic year
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

}
