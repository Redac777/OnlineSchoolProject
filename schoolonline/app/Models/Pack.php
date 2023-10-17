<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;
    protected $table = 'packs';

    protected $fillable = ['nom', 'prix', 'durée', 'year_id'];
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}