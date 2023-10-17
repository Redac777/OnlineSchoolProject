<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Level;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function store(Request $request)
    {
        // Validez les données du formulaire
        $request->validate([
            'lastName' => 'required|string',
            'firstName' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'school_id' => 'required|integer',
            'code' => 'required|string',
            'password' => 'required|string',
            // Assurez-vous que le nom correspond à votre champ de sélection des niveaux
            'selectedClasses' => 'required|array',
            // Assurez-vous que le nom correspond à votre champ de sélection des classes
            'selectedSubjects' => 'required|array',
            // Assurez-vous que le nom correspond à votre champ de sélection des matières
        ]);

        // Créez un nouvel utilisateur avec le rôle d'enseignant (vous devrez peut-être ajuster cela en fonction de votre logique de rôles)
        $user = new User();
        $user->code = $request->input("code");
        $user->password = Hash::make($request->input('password'));
        $user->lastName = $request->input("lastName");
        $user->firstName = $request->input("firstName");
        $user->user_type = "teacher";
        $user->school_id = $request->input("school_id");
        $user->email = $request->input("email");
        $user->phone = $request->input("phone");
        $user->save();


        $teacher = new Teacher();
        $teacher->user_id = $user->id;
        $teacher->school_id = $request->input("school_id");
        $teacher->save();

        // Attachez les classes sélectionnées à l'enseignant avec les fichiers et les années correspondantes
        foreach ($request->input('selectedClasses') as $classData) {
            $classId = $classData['value'];
            $teacher->classes()->attach(
                $classId,
                [
                    'file_id' => null,
                    'teacher_id' => $teacher->id,
                ]
            );
        }

        // Attachez les matières sélectionnées à l'enseignant
        $subjectIds = array_column($request->input('selectedSubjects'), 'value');
        $teacher->subjects()->attach($subjectIds, ['teacher_id' => $teacher->id]);

        return response()->json(['success' => true, 'teacher' => $teacher]);
    }

    public function listTeachers(Request $request)
    {
        $school = $request->input('school');
        $year = $request->input('selectedYear');
        $teachers = Teacher::with('user', 'classes', 'subjects')
            ->where("school_id", $school)->where("year_id", $year)->get();
        return $teachers;
    }

    public function detachClassFromTeacher($teacher_id, $class_id)
    {

        $teacher = Teacher::findOrFail($teacher_id);

        // Use detach to remove the class from the teacher's classes
        $teacher->classes()->detach($class_id);

        return response()->json(['success' => true, 'teacher' => $teacher]);
    }

    public function detachSubjectFromTeacher($teacher_id, $subject_id)
    {

        $teacher = Teacher::findOrFail($teacher_id);

        // Use detach to remove the class from the teacher's subjects
        $teacher->subjects()->detach($subject_id);

        return response()->json(['success' => true, 'teacher' => $teacher]);
    }


    public function deleteTeacher(Request $request, $id)
    {
        // Recherchez le département par son ID
        $user = User::find($id);

        // Vérifiez si le département existe
        if (!$user) {
            return response()->json(['message' => 'Le professeur n\'existe pas'], 404);
        }

        // Assurez-vous que l'utilisateur connecté peut supprimer ce département (vous pouvez ajouter votre propre logique d'autorisation ici)

        // Supprimez le département
        $user->delete();

        // Répondez avec un message de succès
        return response()->json(['message' => 'Le professeur a été supprimé avec succès']);
    }


    public function getClassesNotAssociatedWithTeacher($teacherId)
    {
        try {
            // Récupérez le professeur par son ID
            $teacher = Teacher::findOrFail($teacherId);

            // Récupérez les classes associées au professeur
            $associatedClassIds = $teacher->classes->pluck('id')->toArray();

            // Récupérez toutes les classes qui ne sont pas associées au professeur
            $availableClasses = Classe::whereNotIn('id', $associatedClassIds)->get();

            return response()->json(['success' => true, 'availableClasses' => $availableClasses]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error fetching classes'], 500);
        }
    }

    public function attachClassToTeacher($teacherId, $classId)
    {
        try {
            // Récupérez le professeur par son ID
            $teacher = Teacher::findOrFail($teacherId);

            // Vérifiez si la classe est déjà associée au professeur
            $classe = $classId;
            if (!$teacher->classes->contains($classe)) {
                // Si la classe n'est pas déjà associée, attachez-la
                $teacher->classes()->attach($classe);
            }

            return response()->json(['success' => true, 'message' => 'Class attached to teacher']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error attaching class to teacher'], 500);
        }
    }
    public function getSubjectsNotAssociatedWithTeacher($teacherId)
    {
        try {
            // Retrieve the teacher by their ID
            $teacher = Teacher::findOrFail($teacherId);

            // Retrieve the subjects associated with the teacher
            $associatedSubjectIds = $teacher->subjects->pluck('id')->toArray();

            // Retrieve all subjects that are not associated with the teacher
            $availableSubjects = Subject::whereNotIn('id', $associatedSubjectIds)->get();

            return response()->json(['success' => true, 'availableSubjects' => $availableSubjects]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error fetching subjects'], 500);
        }
    }

    public function attachSubjectToTeacher($teacherId, $subjectId)
    {
        try {
            // Retrieve the teacher by their ID
            $teacher = Teacher::findOrFail($teacherId);

            // Check if the subject is already associated with the teacher
            $subject = $subjectId;
            if (!$teacher->subjects->contains($subject)) {
                // If the subject is not already associated, attach it
                $teacher->subjects()->attach($subject);
            }

            return response()->json(['success' => true, 'message' => 'Subject attached to teacher']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error attaching subject to teacher'], 500);
        }
    }

    public function getTeacherLevels(Request $request)
    {
        $teacherId = $request->input('teacher_id');
        $schoolId = $request->input('school_id');
        $yearId = $request->input('year_id');
        $teacher = Teacher::where('user_id', $teacherId)->first();

        if (!$teacher) {
            // Gérez le cas où le professeur n'a pas été trouvé (éventuellement renvoyez une réponse JSON appropriée)
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        // Récupérez les niveaux associés au professeur, à l'école et à l'année
        $classes = $teacher->classes()->get();

        // Ensuite, récupérez les niveaux associés à ces classes
        $levelIds = $classes->pluck('level_id')->unique();
        $levels = Level::whereIn('id', $levelIds)
            ->where('school_id', $schoolId)
            ->where('year_id', $yearId)
            ->get();
        return response()->json(['success' => true, 'levels' => $levels]);
    }

    public function getTeacherClasses(Request $request)
    {
        $teacherId = $request->input('teacher_id');
        $schoolId = $request->input('school_id');
        $yearId = $request->input('year_id');
        $levelId = $request->input('level_id');

        // Récupérez le professeur par son user_id
        $teacher = Teacher::where('user_id', $teacherId)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        // Récupérez les classes associées au niveau, à l'école, à l'année et au professeur
        $classes = $teacher->classes()
            ->where('level_id', $levelId)
            ->where('school_id', $schoolId)
            ->where('classes.year_id', $yearId)
            ->get();

        return response()->json(['success' => true, 'classes' => $classes]);
    }
    public function getTeacherCount(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');
        $teacherCount = Teacher::where('school_id', $schoolId)
            ->where('year_id', $selectedYear)
            ->count();
        return response()->json(['teacherCount' => $teacherCount]);
    }




}