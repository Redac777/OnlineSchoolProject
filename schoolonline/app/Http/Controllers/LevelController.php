<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\School;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    //
    public function index(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $school = $request->input('school');
        $levels = Level::with('school', 'classes')->where('year_id', $selectedYear)
            ->where('school_id', $school)->get();
        return $levels;
    }

    public function deleteLevel($id)
    {
        $level = Level::find($id);

        if (!$level) {
            return response()->json(['message' => 'Level not found'], 404);
        }

        $level->delete();

        return response()->json(['message' => 'Level deleted successfully']);
    }


    public function createLevel(Request $request)
    {
        // Validez les données reçues du formulaire
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'school_id' => 'required|integer',
            'year_id' => 'nullable',
            // Ajoutez d'autres règles de validation selon vos besoins
        ]);

        $level = new Level();
        $level->name = $request->input('name');
        $level->category = $request->input('category');
        $level->school_id = $request->input('school_id');
        $level->year_id = $request->input('year_id');
        $level->save();

        // Faites d'autres opérations nécessaires

        // Redirigez avec un message de succès
        return response()->json(['success' => true, 'level' => $level]);
    }

    public function updateLevel(Request $request, $id)
    {
        $level = Level::find($id);

        if (!$level) {
            return response()->json(['message' => 'Level not found'], 404);
        }

        $level->name = $request->input('name');
        $level->category = $request->input('category');
        $level->save();

        return response()->json(['message' => 'Level updated successfully']);
    }
}