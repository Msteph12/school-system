<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamTimetableDay extends Model
{
    protected $fillable = [
        'exam_timetable_id',
        'exam_date',
        'day_name',
    ];

    public function timetable(): BelongsTo
    {
        return $this->belongsTo(ExamTimetable::class, 'exam_timetable_id');
    }

    public function slots(): HasMany
    {
        return $this->hasMany(ExamTimetableSlot::class);
    }
}
