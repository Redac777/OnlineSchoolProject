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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('classe_id');
            $table->string('arabLastName');
            $table->string('arabFirstName');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('classe_id')->references('id')->on('classes')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('year_id')->references('id')->on('years')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};