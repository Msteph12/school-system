<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('teacher_attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('teacher_id')
                  ->constrained('teachers')
                  ->cascadeOnDelete();

            $table->foreignId('academic_year_id')
                  ->constrained('academic_years')
                  ->cascadeOnDelete();

            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late', 'on_leave', 'sick', 'half-day']);
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();

            $table->timestamps();

            // One attendance record per teacher per day
            $table->unique(['teacher_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_attendances');
    }
};

