<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Year extends Model
{
    use HasFactory;
    protected $table = "years";
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
    ];
    public static function getCurrentYearId()
    {
        $currentDate = Carbon::now();

        // Recherche de l'année scolaire en cours en fonction de la date actuelle
        $currentYear = Year::where('start_date', '<=', $currentDate)
            ->where('end_date', '>=', $currentDate)
            ->first();

        if ($currentYear) {
            return $currentYear->id;
        }

    }
}