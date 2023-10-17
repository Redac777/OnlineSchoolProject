<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\School;
use App\Models\Level;

class Subject extends Model
{
    use HasFactory;
    protected $table = 'subjects';
    protected $fillable = ['name', 'year_id', 'school_id'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function levels()
    {
        return $this->belongsToMany(Level::class, 'level_subject')
            ->withPivot('coefficient');
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}