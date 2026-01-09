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
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();

            // Grade-based (NOT class-based)
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->constrained()->cascadeOnDelete();

            // Fees data
            $table->decimal('mandatory_amount', 10, 2);
            $table->json('optional_fees')->nullable();

            // Payment + document info
            $table->json('payment_details')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();

            // One fee structure per grade per term per year
            $table->unique(['grade_id', 'academic_year_id', 'term_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_structures');
    }
};
