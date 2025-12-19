<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GradeSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id',
        'subject_id', // active, inactive
    ];

    /**
     * This curriculum rule belongs to one grade.
     */
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    /**
     * This curriculum rule belongs to one subject.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
