<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\File;
use App\Models\School;
use App\Models\User;


class Post extends Model
{
    use HasFactory;
    protected $table = 'posts';

    protected $fillable = ['recipient', 'post_title', 'post_content', 'file_id', 'user_id', 'school_id', 'year_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function file()
    {
        return $this->belongsTo(File::class, 'file_id');
    }
    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');

    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}