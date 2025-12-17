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
        'starts_at',
        'ends_at',
        'is_active',
    ];

    /**
     * A term belongs to an academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
