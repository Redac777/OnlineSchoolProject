<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $table = "services";

    protected $fillable = [
        'name',
        'school_id',
        'year_id',
    ];


    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');

    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
    public function levels()
    {
        return $this->belongsToMany(Level::class, 'service_level')
            ->withPivot('price');
    }
    public function students()
    {
        return $this->belongsToMany(Student::class, 'service_student')
            ->withPivot('price');
    }
}