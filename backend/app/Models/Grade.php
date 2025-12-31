<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'order',
    ];

    /**
     * A grade has many classes.
     */
    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }
}
