<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();

            $table->string('name'); // e.g. "2025" or "2025/2026"
            $table->date('start_date');
            $table->date('end_date');

            $table->boolean('is_active')->default(false);
            $table->string('status')->default('active');


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
