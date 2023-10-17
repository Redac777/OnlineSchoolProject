<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\School;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $fillable = [
        'user_type',
        'code',
        'password',
        'username',
        'lastName',
        'firstName',
        'gender',
        'birthDay',
        'account',
        'email',
        'lang',
        'userProfil',
        'address',
        'phone',
        'school_id',
        'year_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}