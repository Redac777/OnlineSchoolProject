<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = ['user_id', 'school_id', 'year_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function year()
    {
        return $this->belongsTo(Year::class);
    }

    // Définissez ici les relations avec les classes et les matières
    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'teacher_class', 'teacher_id', 'class_id')
            ->withPivot('file_id', 'year_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject', 'teacher_id', 'subject_id')
            ->withPivot('year_id');
    }
}