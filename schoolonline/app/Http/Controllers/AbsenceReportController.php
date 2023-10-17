<?php

namespace App\Http\Controllers;

use App\Models\AbsenceReport;
use App\Models\AbsenceReportDetail;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;

class AbsenceReportController extends Controller
{

    public function createAbsenceReport(Request $request)
    {
        $schoolId = $request->input('schoolId');
        $classId = $request->input('classId');
        $userId = auth()->user()->id; // Obtenez l'ID de l'utilisateur actuellement connecté
        $teacher = Teacher::where('user_id', $userId)->first();

        // Check if a teacher was found
        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found for this user'], 404);
        }

        // Extract the teacher's ID
        $teacherId = $teacher->id;
        $reportData = $request->input('report');

        // Créer un nouveau rapport d'absence
        // Vérifier s'il y a au moins une entrée avec "attendance" égal à "retard" ou "absence"
        $hasValidEntries = false;

        foreach ($reportData as $entry) {
            if ($entry['attendance'] === 'retard' || $entry['attendance'] === 'absence') {
                $hasValidEntries = true;
                break; // Sortir de la boucle dès qu'une entrée valide est trouvée
            }
        }

        // Créer l'AbsenceReport uniquement s'il y a des entrées valides
        if ($hasValidEntries) {
            $absenceReport = new AbsenceReport();
            $absenceReport->teacher_id = $teacherId;
            $absenceReport->school_id = $schoolId;
            $absenceReport->class_id = $classId;
            $absenceReport->save();

            // Parcourir les données du rapport et créer les détails du rapport d'absence
            foreach ($reportData as $entry) {
                if ($entry['attendance'] === 'retard' || $entry['attendance'] === 'absence') {
                    $absenceReportDetail = new AbsenceReportDetail();
                    $absenceReportDetail->report_id = $absenceReport->id;
                    $absenceReportDetail->student_id = $entry['studentId'];
                    $absenceReportDetail->attendance = $entry['attendance'];
                    $absenceReportDetail->remark = $entry['remark'];
                    $absenceReportDetail->validated = false; // Vous pouvez définir la valeur par défaut comme nécessaire
                    $absenceReportDetail->save();
                }
            }
        }


        // Réponse réussie
        return response()->json(['message' => 'Rapport d\'absence créé avec succès'], 201);
    }

    public function listTeacherAbsenceReports(Request $request)
    {
        $classe = $request->input('class_id');
        // Récupérez l'ID de l'utilisateur connecté
        $userId = auth()->user()->id;
        if ($classe) {
            $absenceReports = AbsenceReport::with([
                'teacher.user',
                'class',
                'details' => function ($query) {
                    $query->with('student.user'); // Load the user relation for each student
                },
            ])
                ->where('year_id', $request->input('selectedYear'))
                ->where('school_id', $request->input('school'))
                ->where('class_id', $classe)
                ->whereHas('teacher.user', function ($query) use ($userId) {
                    $query->where('id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $absenceReports = AbsenceReport::with([
                'teacher.user',
                'class',
                'details' => function ($query) {
                    $query->with('student.user'); // Load the user relation for each student
                },
            ])
                ->where('year_id', $request->input('selectedYear'))
                ->where('school_id', $request->input('school'))
                ->whereHas('teacher.user', function ($query) use ($userId) {
                    $query->where('id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }
        // Fetch the list of absence reports from the database


        return $absenceReports;
    }


    public function listSchoolAbsenceReports(Request $request)
    {
        $classe = $request->input('class_id');
        // Récupérez l'ID de l'utilisateur connecté
        $userId = auth()->user()->id;
        if ($classe) {
            $absenceReports = AbsenceReport::with([
                'teacher.user',
                'class',
                'details' => function ($query) {
                    $query->with('student.user'); // Load the user relation for each student
                },
            ])
                ->where('year_id', $request->input('selectedYear'))
                ->where('school_id', $request->input('school'))
                ->where('class_id', $classe)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $absenceReports = AbsenceReport::with([
                'teacher.user',
                'class',
                'details' => function ($query) {
                    $query->with('student.user');
                },
            ])
                ->where('year_id', $request->input('selectedYear'))
                ->where('school_id', $request->input('school'))
                ->orderBy('created_at', 'desc')
                ->get();
        }
        // Fetch the list of absence reports from the database


        return $absenceReports;
    }
    public function updateValidation(Request $request)
    {
        // Get the selected detail IDs from the request
        $selectedDetailIds = $request->input('selectedDetailIds');

        // Update the validated_field for the selected details
        AbsenceReportDetail::whereIn('id', $selectedDetailIds)->update(['validated' => true]);

        return response()->json(['message' => 'Validation updated successfully']);
    }

    public function getStudentAbsences(Request $request)
    {
        $student = Student::where('user_id', auth()->user()->id)->first();
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');

        if ($student) {
            // Récupérez tous les AbsenceReports qui ont l'étudiant dans leurs AbsenceReportDetails
            $absenceReports = AbsenceReport::whereHas('details', function ($query) use ($student) {
                $query->where('student_id', $student->id)
                    ->where('validated', true);
            })->where('school_id', $schoolId)
                ->where('year_id', $selectedYear)
                ->with('details')->get();
        }
        return response()->json(['success' => true, 'absenceReports' => $absenceReports]);
    }

}