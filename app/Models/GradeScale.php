<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeScale extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',        // Excellent, Above Average, etc.
        'description', // Optional explanation
    ];

    // A grade scale can be used by many marks
    public function marks()
    {
        return $this->hasMany(Marks::class);
    }
}
