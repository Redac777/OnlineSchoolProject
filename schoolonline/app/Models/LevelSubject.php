<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LevelSubject extends Pivot
{
    protected $table = 'level_subject';

    protected $fillable = ['level_id', 'subject_id', 'coefficient', 'year_id'];

    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}