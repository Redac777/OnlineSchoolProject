<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentPaiementDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('student_paiement_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_paiement_id');
            $table->string('month');
            $table->decimal('discount', 8, 2)->nullable();
            $table->decimal('paidAmount', 8, 2);
            $table->timestamps();

            $table->foreign('student_paiement_id')->references('id')->on('students_paiements')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('student_paiement_details');
    }
}