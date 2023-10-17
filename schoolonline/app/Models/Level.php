<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;
use App\Models\Classe;

class Level extends Model
{
    use HasFactory;
    protected $table = 'levels';
    protected $fillable = ['name', 'year_id', 'category', 'school_id'];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}