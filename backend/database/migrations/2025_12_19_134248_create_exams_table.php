<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();

            $table->date('exam_date');
            $table->unsignedInteger('total_marks');

            $table->timestamps();

            // Prevent duplicate exams for same context
            $table->unique([
                'class_id',
                'subject_id',
                'term_id',
                'academic_year_id',
                'name'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
