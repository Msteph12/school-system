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

            // Relationships
            $table->foreignId('exam_type_id')->constrained('exam_types')->cascadeOnDelete();

            // UI-driven fields
            $table->string('term');   // e.g. Term 1
            $table->string('grade');  // e.g. Grade 9

            // Dates & status
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['scheduled', 'active', 'completed'])->default('scheduled');

            // Optional attachment
            $table->string('attachment')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
