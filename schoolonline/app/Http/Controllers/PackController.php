<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    //
    public function getAllPacks(Request $request)
    {
        //$packs = Pack::All();
        $selectedYear = $request->input('selectedYear');
        if ($selectedYear) {
            $packs = Pack::where('name', '!=', 'none')
                ->where('year_id', $selectedYear)->get();
        } else
            $packs = Pack::where('name', '!=', 'none')->get();

        return response()->json($packs);
    }
    public function createPack(Request $request)
    {
        // Validez les données reçues du formulaire
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'duration' => 'required|integer',
            'year_id' => 'nullable',
            // Ajoutez d'autres règles de validation selon vos besoins
        ]);

        $pack = new Pack();
        $pack->name = $request->input('name');
        $pack->price = $request->input('price');
        $pack->duration = $request->input('duration');
        $pack->year_id = $request->input('year_id');
        $pack->save();

        // Faites d'autres opérations nécessaires

        // Redirigez avec un message de succès
        return response()->json(['success' => true, 'pack' => $pack]);
    }

    public function deletePack($id)
    {
        $pack = Pack::find($id);

        if (!$pack) {
            return response()->json(['message' => 'Pack not found'], 404);
        }

        if ($pack->id === 1) {
            return response()->json(['message' => 'Cannot delete this pack'], 400);
        }

        $pack->delete();

        return response()->json(['message' => 'Pack deleted successfully']);
    }

    public function getPackCount()
    {
        $packCount = Pack::where('name', '!=', 'none')->count();

        return response()->json(['packCount' => $packCount]);
    }
    public function updatePack(Request $request, $id)
    {
        $pack = Pack::find($id);

        if (!$pack) {
            return response()->json(['message' => 'Pack not found'], 404);
        }

        $pack->name = $request->input('name');
        $pack->price = $request->input('price');
        $pack->duration = $request->input('duration');
        $pack->save();

        return response()->json(['message' => 'Pack updated successfully']);
    }

}
