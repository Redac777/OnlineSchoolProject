<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $table = 'departments';
    protected $fillable = ['name', 'user_id', 'year_id', 'school_id'];

    // Définir la relation vers l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }


}