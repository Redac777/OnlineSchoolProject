<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\School;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    //
    public function createClass(Request $request)
    {
        // Validez les données reçues du formulaire
        $request->validate([
            'name' => 'required|string',
            'level' => 'required|integer',
            'school_id' => 'required|integer',
            'year_id' => 'nullable',
            // Ajoutez d'autres règles de validation selon vos besoins
        ]);

        $classe = new Classe();
        $classe->name = $request->input('name');
        $classe->level_id = $request->input('level');
        $classe->school_id = $request->input('school_id');
        $classe->year_id = $request->input('year_id');
        $classe->save();

        // Faites d'autres opérations nécessaires

        // Redirigez avec un message de succès
        return response()->json(['success' => true, 'classe' => $classe]);
    }


    public function listClasses(Request $request)
    {
        $selectedLevelId = $request->input('level_id');
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');

        $query = Classe::query()->with('level'); // Eager load the 'level' relation

        if ($selectedLevelId) {
            $query->where('level_id', $selectedLevelId)->where('year_id', $selectedYear);
        }

        $classes = $query->where('year_id', $selectedYear)->where('school_id', $schoolId)->get();

        return response()->json($classes);
    }

    public function deleteClass($id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        $classe->delete();

        return response()->json(['message' => 'Class deleted successfully']);
    }

    public function updateClass(Request $request, $id)
    {
        $classe = Classe::find($id);
        if (!$classe) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        $classe->name = $request->input('name');
        $classe->save();

        return response()->json(['message' => 'Class updated successfully']);
    }

}