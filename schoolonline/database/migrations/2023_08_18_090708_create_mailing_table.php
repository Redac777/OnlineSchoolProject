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
        Schema::create('mailing', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('recipient_id');
            $table->text('content');
            $table->string('subject');
            $table->unsignedBigInteger('year_id')->default(Year::getCurrentYearId());
            $table->foreign('year_id')->references('id')->on('years');
            $table->boolean('read')->default(false);
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailing');
    }
};