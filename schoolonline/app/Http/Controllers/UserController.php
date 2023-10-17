<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    // public function index()
    // {
    //     $users = User::all();
    //     return Inertia::render('User/Index', ['users' => $users]);
    // }

    public function authenticate(Request $request)
    {
        if (Auth::check()) {
            $user = auth()->user();
            return ['success' => true, 'message' => 'User is already authenticated', 'user' => $user];
        }

        $credentials = $request->only('code', 'password');

        if (auth()->attempt($credentials)) {
            $user = auth()->user();
            return [
                'success' => true,
                'user' => $user,
            ]; // Authentication successful
        }

        return [
            'success' => false,
            'message' => 'Authentication failed'
        ];
    }
    public function logout()
    {
        Auth::logout();
    }

    public function getAuthenticatedUser(Request $request)
    {
        $user = $request->user()->load('school');
        return response()->json($user);
    }

    public function profile()
    {
        // ... your logic
        return Inertia::render('Profile');
    }

    public function updateProfile(Request $request, $id)
    {

        // Validation
        $request->validate([
            'password' => 'nullable',
            'username' => 'nullable',
            'lastName' => 'required',
            'firstName' => 'required',
            'email' => 'required',
            'address' => 'nullable',
            'phone' => 'nullable',
            'lang' => 'nullable',
            'userProfil' => 'nullable',
            'gender' => 'nullable',
            'birthDay' => 'nullable',

            // ... autres champs à valider ...
        ]);
        $user = User::findOrFail($id);

        // Mettre à jour les champs de l'utilisateur
        if ($request->password)
            $user->password = bcrypt($request->password);
        $user->username = $request->username;
        $user->lastName = $request->lastName;
        $user->firstName = $request->firstName;
        $user->email = $request->email;
        $user->address = $request->address;
        $user->phone = $request->phone;
        $user->lang = $request->lang;
        $user->userProfil = $request->userProfil;
        $user->gender = $request->gender;
        $user->birthDay = $request->birthDay;

        $user->save();

        $updatedUser = User::findOrFail($id);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $updatedUser]);
    }


    public function deactivateSchoolUsers($schoolId)
    {
        try {
            // Récupérez l'école en fonction de son ID
            $school = School::findOrFail($schoolId);

            // Récupérez tous les utilisateurs associés à cette école
            $users = $school->users;

            // Désactivez chaque utilisateur
            foreach ($users as $user) {
                $user->update(['account' => 'deactivated']);
            }

            // Réponse réussie
            return response()->json(['message' => 'All school users have been deactivated.'], 200);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json(['message' => 'Error deactivating school users.'], 500);
        }
    }

    public function activateSchoolUsers($schoolId)
    {
        try {
            // Récupérez l'école en fonction de son ID
            $school = School::findOrFail($schoolId);

            // Récupérez tous les utilisateurs associés à cette école
            $users = $school->users;

            // Activez chaque utilisateur
            foreach ($users as $user) {
                $user->update(['account' => 'activated']);
            }

            // Réponse réussie
            return response()->json(['message' => 'All school users have been activated.'], 200);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json(['message' => 'Error activating school users.'], 500);
        }
    }

    public function getUserByCode(Request $request, $email)
    {
        // Rechercher l'utilisateur en fonction du code
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json($user);
    }

    public function deleteUser($id, $id2, $id3)
    {
        $user = User::find($id);
        $user2 = User::find($id2);
        $user3 = User::find($id3);

        if (!$user || !$user2) {
            return response()->json(['message' => 'User not found'], 404);
        } else {
            if ($user3)
                $user3->delete();
            $user->delete();
            $user2->delete();

        }
        return response()->json(['message' => 'User deleted successfully']);
    }


}