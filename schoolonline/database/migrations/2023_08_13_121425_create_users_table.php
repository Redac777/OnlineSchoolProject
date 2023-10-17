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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('user_type')->required();
            $table->string('code', 191)->unique()->required();
            $table->string('password')->required();
            $table->string('username')->nullable();
            $table->string('lastName')->required();
            $table->string('firstName')->required();
            $table->string('gender')->nullable();
            $table->date('birthDay')->nullable();
            $table->string('account')->nullable()->default("activated");
            $table->string('email')->nullable();
            $table->string('lang')->nullable()->default("eng");
            $table->string('userProfil')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('school_id');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('year_id')->references('id')->on('years');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};