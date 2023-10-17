<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPaiementDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_paiement_id',
        'month',
        'discount',
        'paidAmount',
    ];

    public function paiement()
    {
        return $this->belongsTo(StudentsPaiements::class, 'student_paiement_id');
    }
}