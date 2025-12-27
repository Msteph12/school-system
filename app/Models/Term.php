<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Term extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'name',
        'order',
        'start_date',
        'end_date',
        'is_active',
        'is_closed',
    ];

    /**
     * A term belongs to an academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
