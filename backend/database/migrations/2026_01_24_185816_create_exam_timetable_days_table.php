<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_timetable_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_timetable_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->date('exam_date');
            $table->string('day_name'); // Tuesday, Wednesday, etc
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_timetable_days');
    }
};
