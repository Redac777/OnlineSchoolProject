<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class School extends Model
{
    use HasFactory;
    protected $table = 'schools';

    protected $fillable = [
        'name',
        'city',
        'address',
        'manager',
        'phone',
        'logo',
        'year',
    ];
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }

}