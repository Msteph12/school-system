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
    Schema::table('teacher_attendances', function (Blueprint $table) {
        $table->foreignId('academic_year_id')
              ->after('teacher_id')
              ->constrained()
              ->cascadeOnDelete();
    });
}

public function down(): void
{
    Schema::table('teacher_attendances', function (Blueprint $table) {
        $table->dropForeign(['academic_year_id']);
        $table->dropColumn('academic_year_id');
    });
}

};
