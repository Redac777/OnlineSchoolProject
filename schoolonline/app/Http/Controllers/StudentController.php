<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    //
    public function createStudent(Request $request)
    {
        // Validez les données reçues du formulaire
        $request->validate([
            'studentLastName' => 'required',
            'studentFirstName' => 'required',
            'arablastName' => 'required',
            'arabfirstName' => 'required',
            'gender' => 'required',
            'birthDay' => 'required',
            'address' => 'required',
            'codeMassar' => 'required',
            'tutorOneLastName' => 'required',
            'tutorTwoLastName' => 'nullable',
            'tutorOneFirstName' => 'required',
            'tutorTwoFirstName' => 'nullable',
            'tutorOneCin' => 'required',
            'tutorTwoCin' => 'nullable',
            'tutorOneTel' => 'required',
            'tutorTwoTel' => 'nullable',
            'tutorOneEmail' => 'required',
            'tutorTwoEmail' => 'nullable',
            'tutorOneJob' => 'required',
            'tutorTwoJob' => 'nullable',
            'studentPassword' => 'required',
            'tutorOnePassword' => 'required',
            'tutorTwoPassword' => 'nullable',
            'tutorOneCode' => 'required',
            'tutorTwoCode' => 'nullable',
            'classId' => 'required',
            'schoolId' => 'required',

            // Ajoutez d'autres règles de validation selon vos besoins
        ]);

        $user1 = new User();
        $user1->code = $request->input('codeMassar');
        $user1->lastName = $request->input('studentLastName');
        $user1->firstName = $request->input('studentFirstName');
        $user1->gender = $request->input('gender');
        $user1->birthDay = $request->input('birthDay');
        $user1->address = $request->input('address');
        $user1->school_id = $request->input('schoolId');
        $user1->user_type = "student";
        $user1->password = Hash::make($request->input('studentPassword'));
        $user1->save();

        $student = new Student();
        $student->arabLastName = $request->input('arablastName');
        $student->arabFirstName = $request->input('arabfirstName');
        $student->user_id = $user1->id;
        $student->classe_id = $request->input('classId');
        $student->save();

        $user2 = new User();
        $user2->code = $request->input('tutorOneCode');
        $user2->password = Hash::make($request->input('tutorOnePassword'));
        $user2->lastName = $request->input('tutorOneLastName');
        $user2->firstName = $request->input('tutorOneFirstName');
        $user2->phone = $request->input('tutorOneTel');
        $user2->email = $request->input('tutorOneEmail');
        $user2->school_id = $request->input('schoolId');
        $user2->user_type = "tutor";
        $user2->save();

        $tutor1 = new Tutor();
        $tutor1->cin = $request->input('tutorOneCin');
        $tutor1->job = $request->input('tutorOneJob');
        $tutor1->user_id = $user2->id;
        $tutor1->save();

        if ($request->input('tutorTwoLastName') != "") {

            $user3 = new User();
            $user3->code = $request->input('tutorTwoCode');
            $user3->password = Hash::make($request->input('tutorTwoPassword'));
            $user3->lastName = $request->input('tutorTwoLastName');
            $user3->firstName = $request->input('tutorTwoFirstName');
            $user3->phone = $request->input('tutorTwoTel');
            $user3->email = $request->input('tutorTwoEmail');
            $user3->school_id = $request->input('schoolId');
            $user3->user_type = "tutor";
            $user3->save();

            $tutor2 = new Tutor();
            $tutor2->cin = $request->input('tutorTwoCin');
            $tutor2->job = $request->input('tutorTwoJob');
            $tutor2->user_id = $user3->id;
            $tutor2->save();

            $student->parents()->attach([$tutor1->id, $tutor2->id]);


        } else {
            $student->parents()->attach([$tutor1->id]);
        }


        // Faites d'autres opérations nécessaires

        // Redirigez avec un message de succès
        return response()->json([
            'success' => true,
            'student' => $student->load('user', 'classe', 'parents.user'),
            // Chargez la relation "user" pour inclure les données de l'utilisateur
        ]);
    }

    public function listStudents(Request $request)
    {
        $selectedClassId = $request->input('classe_id');
        $selectedYear = $request->input('selectedYear');
        $selectedSchoolId = $request->input('school');

        $query = Student::query()->with([
            'classe',
            'user',
            // Load user data for students
            'parents' => function ($query) {
                $query->with('user'); // Load user data for parents
            }
        ]);


        if ($selectedClassId) {
            $query->where('classe_id', $selectedClassId);
        }

        $students = $query
            ->where('year_id', $selectedYear)
            ->whereHas('user', function ($query) use ($selectedSchoolId) {
                $query->where('school_id', $selectedSchoolId);
            })
            ->get();


        return response()->json($students);
    }
    public function deleteStudent($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
    public function upgradeStudents(Request $request)
    {
        $sourceClassId = $request->input('sourceClassId');
        $targetClassId = $request->input('targetClassId');
        $selectedStudents = $request->input('selectedStudents');

        // Mettez à jour les étudiants sélectionnés avec la nouvelle classe
        Student::whereIn('id', $selectedStudents)
            ->update(['classe_id' => $targetClassId]);

        // Vous pouvez renvoyer une réponse JSON pour indiquer le succès de l'opération
        return response()->json(['message' => 'Les étudiants ont été mis à jour avec succès']);
    }



    public function getStudentTeachers(Request $request)
    {
        $student = Student::where('user_id', auth()->user()->id)->first();

        if ($student) {
            // Obtenez la classe à laquelle l'étudiant est affecté
            $class = $student->classe;
            $yearId = $request->input('selectedYear');
            if ($class) {
                // Obtenez les enseignants qui enseignent cette classe
                $teachers = Teacher::whereHas('classes', function ($query) use ($class, $yearId) {
                    $query->where('class_id', $class->id)
                        ->where('classes.year_id', $yearId);
                })->with('user')->get();

                return response()->json(['success' => true, 'teachers' => $teachers]);

                // Maintenant, $teachers contient la liste des enseignants pour la classe de l'étudiant.
            }
        }
    }

    public function getStudentLevelAndClass()
    {
        $student = Student::where('user_id', auth()->user()->id)->first();

        if ($student) {
            // Obtenez la classe à laquelle l'étudiant est affecté
            $class = $student->classe;
            $level = $class->level;

            return response()->json(['success' => true, 'level' => $level, 'classe' => $class]);

            // Maintenant, $teachers contient la liste des enseignants pour la classe de l'étudiant.
        }

    }
    public function getAuthenticatedStudent()
    {
        $student = Student::where('user_id', auth()->user()->id)->first();
        return response()->json(['student' => $student]);
    }

    public function getStudentCount(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');
        $studentCount = Student::whereHas('user', function ($query) use ($schoolId, $selectedYear) {
            $query->where('school_id', $schoolId)
                ->where('year_id', $selectedYear);
        })->count();
        return response()->json(['studentCount' => $studentCount]);
    }


}