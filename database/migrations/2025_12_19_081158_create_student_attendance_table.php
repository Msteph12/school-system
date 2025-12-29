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
 Schema::create('student_attendances', function (Blueprint $table) {
    $table->id();

    // Core links
    $table->foreignId('student_id')->constrained()->cascadeOnDelete();
    $table->foreignId('class_student_id')->constrained('class_students')->cascadeOnDelete();
    $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
    $table->foreignId('term_id')->constrained()->cascadeOnDelete();

    // Attendance meaning
    $table->enum('status', [
        'reported',     // student reported at start of term
        'present',      // actively in school
        'sent_home',    // sent home (fees, discipline, etc.)
        'returned',     // came back after absence
        'withdrawn'     // permanently left
    ]);

    $table->string('reason')->nullable(); 
    // e.g. fees arrears, illness, discipline

    // Period tracking
    $table->date('from_date');
    $table->date('to_date')->nullable(); 
    // null = still ongoing

    $table->text('remarks')->nullable();

$table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_attendances');
    }
};
