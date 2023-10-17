<?php

use App\Models\Year;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('level_subject', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('level_id');
            $table->unsignedBigInteger('subject_id');
            $table->float('coefficient');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            $table->foreign('year_id')->references('id')->on('years');
            $table->foreign('level_id')->references('id')->on('levels')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('level_subject');
    }
};