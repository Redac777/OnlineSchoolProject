<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentsPaiements extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'school_id',
        'year_id',
    ];

    public function details()
    {
        return $this->hasMany(StudentPaiementDetails::class, 'student_paiement_id');
    }
}