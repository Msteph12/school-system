<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grade_subjects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('grade_id')
                  ->constrained('grades')
                  ->cascadeOnDelete();

            $table->foreignId('subject_id')
                  ->constrained('subjects')
                  ->cascadeOnDelete();

            $table->timestamps();

            // Prevent duplicate subject assignment to same grade
            $table->unique(['grade_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_subjects');
    }
};
