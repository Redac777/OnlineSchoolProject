<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DepartmentController extends Controller
{
    //
    public function listDepartments(Request $request)
    {
        // Récupérer la valeur de school_id à partir de la requête
        $selectedSchoolId = $request->input('school');
        $selectedYear = $request->input('selectedYear');
        // Récupérer les départements en fonction de la school_id
        $departments = Department::with(['user', 'school'])
            ->where('year_id', $selectedYear)
            ->where('school_id', $selectedSchoolId)
            ->get();

        return $departments;
    }

    public function createDepartment(Request $request)
    {
        // Valider les données entrées par l'utilisateur
        $request->validate([
            'name' => 'required|string|max:255',
            'school_id' => 'required|integer|exists:schools,id',
            'code' => 'required',
            'lastName' => 'required',
            'firstName' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'password' => 'required',
            'username' => 'required',

        ]);

        $user = new User();
        $user->lastName = $request->input('lastName');
        $user->firstName = $request->input('firstName');
        $user->email = $request->input('email');
        $user->code = $request->input('code');
        $user->phone = $request->input('phone');
        if ($request->input('name') == "Finance")
            $user->user_type = 'admin-finance';
        else if ($request->input('name') == "Administration")
            $user->user_type = 'admin-administration';
        $user->username = $request->input('username');
        $user->password = Hash::make($request->input('password'));
        $user->school_id = $request->input('school_id');
        $user->save();
        // Créez un nouveau département avec les données validées

        $department = new Department();
        $department->name = $request->input('name');
        $department->school_id = $request->input('school_id');
        $department->user_id = $user->id;
        $department->save();

        // Répondez avec le département nouvellement créé
        return response()->json(['success' => true, 'department' => $department]);
    }

    public function deleteDepartment(Request $request, $id)
    {
        // Recherchez le département par son ID
        $user = User::find($id);

        // Vérifiez si le département existe
        if (!$user) {
            return response()->json(['message' => 'Le département n\'existe pas'], 404);
        }

        // Assurez-vous que l'utilisateur connecté peut supprimer ce département (vous pouvez ajouter votre propre logique d'autorisation ici)

        // Supprimez le département
        $user->delete();

        // Répondez avec un message de succès
        return response()->json(['message' => 'Le département a été supprimé avec succès']);
    }

    public function update(Request $request, $id)
    {
        // Validez les données de la requête
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable',
            'lastName' => 'nullable',
            'firstName' => 'nullable',
            'email' => 'nullable',
            'phone' => 'nullable',
            'password' => 'nullable',
            'username' => 'nullable',
            'school_id' => 'required|integer|exists:schools,id',
        ]);

        try {
            // Récupérez le département à mettre à jour
            $department = Department::findOrFail($id);

            // Mettez à jour le nom du département
            $department->name = $request->input('name');
            $department->save();


            if ($request->input("code")) {
                // Récupérez l'utilisateur admin du département
                $departmentAdmin = User::where('id', $department->user_id)->firstOrFail();
                // Mettez à jour les détails de l'utilisateur admin
                $departmentAdmin->delete();
                $user = new User();
                $user->lastName = $request->input('lastName');
                $user->firstName = $request->input('firstName');
                $user->email = $request->input('email');
                $user->code = $request->input('code');
                $user->user_type = 'admin-department';
                $user->phone = $request->input('phone');
                $user->username = $request->input('username');
                $user->school_id = $request->input('school_id');
                $user->password = Hash::make($request->input('password'));
                $user->save();
                $newDepartment = new Department();
                $newDepartment->name = $request->input('name');
                $newDepartment->school_id = $request->input('school_id');
                $newDepartment->user_id = $user->id;
                $newDepartment->save();
            }
            // Répondez avec une réponse JSON de succès
            return response()->json(['success' => true, 'message' => 'Department updated successfully']);
        } catch (\Exception $e) {
            // En cas d'erreur, répondez avec une réponse JSON d'erreur
            return response()->json(['success' => false, 'message' => 'Error updating department']);
        }
    }

    public function getDepartmentCount(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');
        $departmentCount = Department::where('school_id', $schoolId)
            ->where('year_id', $selectedYear)->count();

        return response()->json(['departmentCount' => $departmentCount]);
    }

}