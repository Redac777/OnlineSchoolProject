<?php

namespace App\Http\Controllers;

use App\Models\Year;
use Illuminate\Http\Request;
use Carbon\Carbon;

class YearController extends Controller
{
    //
    public function listYears()
    {
        $years = Year::all();

        return response()->json($years);
    }
    public function updateYear(Request $request)
    {
        // Obtenez la dernière année enregistrée dans la base de données
        $latestYear = Year::latest()->first();

        // Obtenez la date actuelle
        $currentDate = now();
        $datereq = $request->input('date');
        if ($datereq) {
            if ($datereq > $latestYear->end_date) {
                $newYear = new Year();
                $newYear->start_date = Carbon::parse($latestYear->start_date)->addYear();
                $newYear->end_date = Carbon::parse($latestYear->end_date)->addYear();
                $newYear->name = $newYear->start_date->format('Y') . '-' . $newYear->end_date->format('Y');
                $newYear->save();
            }
        } else {
            if ($currentDate > $latestYear->end_date) {
                // Créez une nouvelle année avec une année supérieure
                $newYear = new Year();
                $newYear->start_date = $latestYear->start_date->addYear();
                $newYear->end_date = $newYear->end_date->addYear();

                $newYear->save();
            }
        }


        // Vérifiez si la date actuelle dépasse la "end_date" de l'année précédente

        if ($newYear)
            return response()->json(['message' => 'Nouvelle année ajoutée avec succès']);
        else
            return response()->json(['message' => 'Année non ajoutée']);

        // Redirigez l'utilisateur ou renvoyez une réponse JSON appropriée
    }
}