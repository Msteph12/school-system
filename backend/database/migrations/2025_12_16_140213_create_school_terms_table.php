<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('terms', function (Blueprint $table) {
            $table->id();
 
            $table->foreignId('academic_year_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('name'); // Term 1, Term 2, Term 3
            $table->unsignedTinyInteger('order'); // 1, 2, 3

            $table->date('start_date');
            $table->date('end_date');

            $table->boolean('is_active')->default(false);
            $table->boolean('is_closed')->default(false);

            $table->timestamps();

            // prevent duplicate terms in the same year
            $table->unique(['academic_year_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terms');
    }
};
