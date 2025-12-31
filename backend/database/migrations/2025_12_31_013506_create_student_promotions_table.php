<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_promotions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')->constrained()->cascadeOnDelete();

            $table->foreignId('from_grade_id')->constrained('grades');
            $table->foreignId('from_class_id')->constrained('classes');

            $table->foreignId('to_grade_id')->constrained('grades');
            $table->foreignId('to_class_id')->constrained('classes');

            $table->foreignId('academic_year_id')->constrained('academic_years');

            $table->foreignId('promoted_by')->constrained('users');

            $table->timestamp('promoted_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_promotions');
    }
};
