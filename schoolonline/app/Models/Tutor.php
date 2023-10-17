<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;
    protected $table = 'parents';
    protected $fillable = ['cin', 'job', 'user_id']; // Ajoutez les colonnes appropriées


    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_parent', 'parent_id', 'student_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}