<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\ExamTimetableDay;
use App\Models\ExamType;

class ExamTimetable extends Model
{
    protected $fillable = [
        'academic_year_id',
        'term_id',
        'exam_type_id',
        'grade_id',
        'start_date',
        'end_date',
        'max_papers_per_day',
        'status',
        'created_by',
    ];

    public function days(): HasMany
    {
        return $this->hasMany(ExamTimetableDay::class);
    }

    public function examType()
    {
        return $this->belongsTo(ExamType::class);
    }
}
