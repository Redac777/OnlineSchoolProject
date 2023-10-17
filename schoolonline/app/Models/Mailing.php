<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Mailing extends Model
{
    use HasFactory;
    protected $table = 'mailing';
    protected $fillable = ['sender_id', 'recipient_id', 'content', 'subject', 'year_id', 'read'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}