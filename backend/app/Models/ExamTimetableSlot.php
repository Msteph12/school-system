<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamTimetableSlot extends Model
{
    protected $fillable = [
        'exam_timetable_day_id',
        'slot_number',
        'subject_id',
        'start_time',
        'end_time',
    ];

    public function day(): BelongsTo
    {
        return $this->belongsTo(ExamTimetableDay::class, 'exam_timetable_day_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
