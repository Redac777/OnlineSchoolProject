<?php

use App\Models\Year;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absence_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('school_id');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            // Add foreign key constraints
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade')->onUpdate('cascade');
            ;
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade')->onUpdate('cascade');
            ;
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade')->onUpdate('cascade');
            ;
            $table->foreign('year_id')->references('id')->on('years')->onDelete('cascade')->onUpdate('cascade');
            ;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absence_reports');
    }
};