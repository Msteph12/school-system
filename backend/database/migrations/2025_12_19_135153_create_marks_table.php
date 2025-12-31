<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();

            $table->unsignedInteger('marks_obtained');
            $table->string('grade')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();

            // One student can only have ONE mark per exam
            $table->unique(['exam_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
