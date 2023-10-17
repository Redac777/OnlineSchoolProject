<?php

namespace App\Http\Controllers;

use App\Models\User;
use APP\Models\Pack;
use Illuminate\Http\Request;

use App\Models\School;
use Illuminate\Support\Facades\Hash;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schools = School::with('users', 'pack')
            ->where('name', '<>', 'Online School')
            ->where('year_id', $selectedYear)
            ->get();
        return $schools;
    }

    public function createSchool(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'city' => 'required',
            'manager' => 'required',
            'code' => 'required',
            'lastName' => 'required',
            'firstName' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'password' => 'required',
            // Ajouter la validation du mot de passe
            'pack_id' => 'required',
            'username' => 'required',
            'year_id' => 'nullable',
        ]);
        $school = new School();
        $school->name = $request->input('name');
        $school->city = $request->input('city');
        $school->manager = $request->input('manager');
        $school->pack_id = $request->input('pack_id');
        $school->year_id = $request->input('year_id');
        $school->save();

        // Créer l'utilisateur admin
        $adminUser = new User();
        $adminUser->code = $request->input('code');
        $adminUser->password = Hash::make($request->input('password')); // Utiliser le mot de passe fourni depuis le composant
        $adminUser->user_type = 'admin-ecole';
        $adminUser->username = $request->input('username');
        $adminUser->lastName = $request->input('lastName');
        $adminUser->firstName = $request->input('firstName');
        $adminUser->email = $request->input('email');
        $adminUser->phone = $request->input('phone');
        $adminUser->school_id = $school->id;
        $adminUser->save();

        // Créer l'école avec la relation vers l'administrateur


        // Associer l'utilisateur admin à l'école


        return response()->json(['success' => true, 'school' => $school, 'adminUser' => $adminUser]);
    }
    public function getSchoolCount()
    {
        $schoolCount = School::where('name', '!=', 'Online school')->count();

        return response()->json(['schoolCount' => $schoolCount]);
    }

    public function updateSchoolProfile(Request $request, $id)
    {

        // Validation
        $request->validate([
            'name' => 'required',
            'city' => 'required',
            'address' => 'required',
            'phone' => 'required',
            'logo' => 'required',
            'manager' => 'required',

            // ... autres champs à valider ...
        ]);
        $school = School::findOrFail($id);

        // Mettre à jour les champs de l'école

        $school->name = $request->name;
        $school->city = $request->city;
        $school->address = $request->address;
        $school->phone = $request->phone;
        $school->logo = $request->logo;
        $school->manager = $request->manager;
        $school->save();

        $updatedSchool = School::findOrFail($id);

        return response()->json(['message' => 'School Profile updated successfully', 'school' => $updatedSchool]);
    }


}