<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('grade_id')
                  ->constrained('grades')
                  ->cascadeOnDelete();

            $table->string('name'); // A, B, C

            $table->string('code')->unique(); // PG-A, G1-B

            $table->foreignId('teacher_id')
                  ->nullable()
                  ->constrained('teachers')
                  ->nullOnDelete();

            $table->unsignedInteger('capacity')->nullable();

            $table->timestamps();

            // Prevent duplicate branches in same grade
            $table->unique(['grade_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
