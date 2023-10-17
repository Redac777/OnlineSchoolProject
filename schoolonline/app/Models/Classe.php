<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;
    protected $table = 'classes';
    protected $fillable = ['name', 'year_id', 'level_id', 'school_id'];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
    public function students()
    {
        return $this->hasMany(Student::class);
    }

}