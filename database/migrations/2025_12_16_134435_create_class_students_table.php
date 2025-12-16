<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('class_students', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('class_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('academic_year_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->timestamps();

            // prevent duplicate enrollment in same year
            $table->unique([
                'student_id',
                'class_id',
                'academic_year_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_students');
    }
};
