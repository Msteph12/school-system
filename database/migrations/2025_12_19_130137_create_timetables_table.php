<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();

            $table->date('date');
            $table->enum('day_of_week', ['mon', 'tue', 'wed', 'thu', 'fri']);
            $table->time('start_time');
            $table->time('end_time');

            $table->string('room')->nullable();

            $table->timestamps();

            // Prevent double-booking for the same class
            $table->unique(['class_id', 'date', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};
