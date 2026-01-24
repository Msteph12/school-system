<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_timetable_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_timetable_day_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->unsignedTinyInteger('slot_number');
            $table->foreignId('subject_id')->constrained();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_timetable_slots');
    }
};
