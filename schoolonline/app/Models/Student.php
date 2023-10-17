<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Classe;
use App\Models\Tutor;

class Student extends Model
{
    protected $fillable = ['user_id', 'arabLastName', 'arabFirstName', 'classe_id', 'year_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }

    public function parents()
    {
        return $this->belongsToMany(Tutor::class, 'student_parent', 'student_id', 'parent_id');
    }
}