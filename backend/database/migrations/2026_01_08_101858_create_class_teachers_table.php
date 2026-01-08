<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('class_teachers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();

            $table->boolean('is_active')->default(true);
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('unassigned_at')->nullable();

            $table->timestamps();

            // Only ONE active class teacher per class per academic year
            $table->unique(
                ['grade_id', 'class_id', 'academic_year_id', 'is_active'],
                'unique_active_class_teacher'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_teachers');
    }
};
