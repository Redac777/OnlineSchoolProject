<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Post;

class File extends Model
{
    protected $table = 'files';
    protected $fillable = ['file_path', 'file_type'];

}