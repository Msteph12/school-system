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

        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
        $table->foreignId('term_id')->constrained()->cascadeOnDelete();

        $table->decimal('amount', 10, 2);

        $table->timestamps();

        $table->unique(['class_id', 'academic_year_id', 'term_id']);
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
