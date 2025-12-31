<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('admission_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['male', 'female']);
            $table->date('date_of_birth');

            $table->enum('status', ['active', 'transferred', 'graduated'])
                  ->default('active');

             // Guardian / Parent information
            $table->string('guardian_name');
            $table->string('guardian_relationship')->nullable();
            $table->string('guardian_phone');
            $table->string('guardian_phone_alt')->nullable();
            $table->text('guardian_address')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
