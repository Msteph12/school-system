<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('class_subjects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('class_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('subject_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->timestamps();

            // prevent duplicate subject assignment to same class
            $table->unique(['class_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_subjects');
    }
};
