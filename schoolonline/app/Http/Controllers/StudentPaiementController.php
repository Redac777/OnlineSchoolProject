<?php

namespace App\Http\Controllers;

use App\Models\StudentPaiementDetails;
use App\Models\StudentsPaiements;
use Illuminate\Http\Request;

class StudentPaiementController extends Controller
{
    public function store(Request $request)
    {
        // Validez les données du formulaire, si nécessaire

        // Créez l'enregistrement StudentsPaiements
        $studentsPaiements = new StudentsPaiements();
        $studentsPaiements->student_id = $request->input('student_id');
        $studentsPaiements->school_id = $request->input('school_id');
        $studentsPaiements->year_id = $request->input('year_id');
        // Définissez d'autres champs au besoin
        $studentsPaiements->save();

        // Récupérez les paiements depuis le front (format attendu : tableau associatif)
        $paiements = $request->input('payments');

        // Parcourez les paiements et créez les enregistrements StudentPaiementDetail
        foreach ($paiements as $paiement) {
            $studentPaiementDetail = new StudentPaiementDetails();
            $studentPaiementDetail->student_paiement_id = $studentsPaiements->id; // Utilisez l'ID du StudentsPaiements créé précédemment
            $studentPaiementDetail->month = $paiement['month'];
            $studentPaiementDetail->discount = $paiement['discount'];
            $studentPaiementDetail->paidAmount = $paiement['total'];
            // Définissez d'autres champs au besoin
            $studentPaiementDetail->save();
        }

        return response()->json([
            'success' => true,
        ]);
    }
    public function getPaymentDetailsForStudent($studentId)
    {
        // Assurez-vous que $studentId est valide (vérifiez les autorisations, etc.)

        // Récupérez l'étudiant avec ses détails de paiement en utilisant la relation details()
        $studentPaiements = StudentsPaiements::with('details')->where('student_id', $studentId)->get();

        // Vérifiez si l'étudiant existe
        if (!$studentPaiements) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Vous pouvez renvoyer l'étudiant avec ses détails au format JSON
        return response()->json($studentPaiements);
    }






}