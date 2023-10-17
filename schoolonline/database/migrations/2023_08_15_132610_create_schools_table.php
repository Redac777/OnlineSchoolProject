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
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191)->unique()->required();
            $table->string('city')->required();
            $table->string('manager')->required();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('logo')->nullable();
            $table->unsignedBigInteger('pack_id')->required();
            $table->foreign('pack_id')->references('id')->on('packs')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            $table->foreign('year_id')->references('id')->on('years');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};