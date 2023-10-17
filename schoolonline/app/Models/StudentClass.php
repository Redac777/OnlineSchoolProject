<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Year;

class StudentClass extends Model
{
    use HasFactory;
    protected $table = 'student_class';

    protected $fillable = ['student_id', 'class_id', 'year_id'];

    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}