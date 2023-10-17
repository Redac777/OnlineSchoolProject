<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absence_report_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('attendance', ['retard', 'absence']);
            $table->text('remark')->nullable();
            $table->boolean('validated')->default(false);

            // Add foreign key constraints
            $table->foreign('report_id')->references('id')->on('absence_reports')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absence_report_details');
    }
};