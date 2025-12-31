<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subject_teachers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('teacher_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('class_subject_id')
                  ->constrained()
                  ->restrictOnDelete();

            $table->timestamps();

            // one teacher per subject per class
            $table->unique(['teacher_id', 'class_subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_teachers');
    }
};
