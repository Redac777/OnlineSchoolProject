<?php

// app/Http/Controllers/ServiceController.php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\School;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function createService(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'prices' => 'required|array',
            'prices.*' => 'numeric|min:1',
            'school_id' => 'required',
            'levels' => 'required|array',
            'levels.*' => 'exists:levels,id',
        ]);

        try {
            // Create the service


            $service = new Service();
            $service->name = $request->input('name');
            $service->school_id = $request->input('school_id');
            $service->save();

            // Attach the levels with their prices
            $selectedLevels = $request->input('levels');
            $prices = $request->input('prices');

            foreach ($selectedLevels as $key => $levelId) {
                $price = $prices[$key] ?? end($prices);

                // Attach the level with its price
                $service->levels()->attach([$levelId => ['price' => $price]]);
            }

            return response()->json(['success' => true, 'service' => $service]);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }

    public function index(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');

        $services = Service::with([
            'levels' => function ($query) use ($selectedYear) {
                $query->where('year_id', $selectedYear)->withPivot('price');
            }
        ])
            ->where('school_id', $schoolId)
            ->get();

        return response()->json($services);
    }


    public function delete($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();

            return response()->json(['message' => 'Service deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Service not found'], 404);
        }
    }

    public function updateServicePrices(Request $request, $serviceId)
    {
        $newPrices = $request->input('updatedPrices');

        // Chargez le service en fonction de l'ID
        $service = Service::findOrFail($serviceId);

        // Parcourez les nouvelles valeurs de prix et mettez à jour la relation
        foreach ($newPrices as $levelId => $newPrice) {
            // Mettez à jour la valeur de prix pour le niveau spécifié
            $service->levels()->updateExistingPivot($levelId, ['price' => $newPrice]);
        }

        return response()->json(['success' => true]);
    }

    public function getServicesByLevel(Request $request)
    {
        $levelId = $request->query('levelId');

        // Utilisez Eloquent pour récupérer les services en fonction de l'ID du niveau
        $services = Service::whereHas('levels', function ($query) use ($levelId) {
            $query->where('level_id', $levelId);
        })->get();

        // Créez un tableau pour stocker les services et leurs prix
        $servicesWithPrices = [];

        // Parcourez les services pour obtenir les prix correspondants
        foreach ($services as $service) {
            // Récupérez le prix du service pour le niveau spécifié
            $price = $service->levels->where('id', $levelId)->first()->pivot->price;

            // Ajoutez le service et son prix au tableau
            $servicesWithPrices[] = [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $price,
            ];
        }

        return response()->json($servicesWithPrices);
    }


    public function getStudentServices(Request $request)
    {
        $studentId = $request->input('studentId');
        $services = Service::whereHas('students', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })->get();
        $servicesWithPrices = [];

        // Parcourez les services pour obtenir les prix correspondants
        foreach ($services as $service) {
            // Récupérez le prix du service pour le niveau spécifié
            $price = $service->students->where('id', $studentId)->first()->pivot->price;

            // Ajoutez le service et son prix au tableau
            $servicesWithPrices[] = [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $price,
            ];
        }

        return response()->json($servicesWithPrices);
    }

    public function detachService(Request $request)
    {
        $studentId = $request->input('studentId');
        $serviceId = $request->input('serviceId');

        // Recherchez l'étudiant et le service
        $student = Student::findOrFail($studentId);
        $service = Service::findOrFail($serviceId);

        // Détachez l'étudiant du service
        $service->students()->detach($studentId);

        return response()->json(['success' => true]);
    }

    public function attachServices(Request $request, $studentId)
    {
        try {
            // Récupérez les données JSON de la requête
            $feesData = $request->json()->all();

            // Assurez-vous que l'étudiant existe
            $student = Student::findOrFail($studentId);

            $attachedServices = [];

            // Parcourez les données des frais et attachez-les au service associé à l'étudiant
            foreach ($feesData as $fee) {
                $serviceId = $fee['serviceId'];
                $price = $fee['price'];

                // Assurez-vous que le service existe
                $service = Service::findOrFail($serviceId);

                // Vérifiez si le service est déjà attaché à l'étudiant
                if (!$service->students->contains($studentId)) {
                    // Attachez l'étudiant au service avec le prix dans la table pivot
                    $service->students()->attach($studentId, ['price' => $price]);
                    $attachedServices[] = [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $price,
                    ];
                }
            }

            return response()->json(['success' => true, 'attachedServices' => $attachedServices]);
        } catch (\Exception $e) {
            // En cas d'erreur, retournez une réponse d'erreur
            return response()->json(['success' => false, 'message' => 'Failed to attach services', 'error' => $e->getMessage()], 500);
        }
    }

    public function getAvailableServices($levelId, $studentId)
    {
        // Récupérez les services liés au niveau
        $levelServices = Service::whereHas('levels', function ($query) use ($levelId) {
            $query->where('level_id', $levelId);
        })->get();

        // Récupérez les services déjà affectés à l'étudiant
        $attachedServices = Service::whereHas('students', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })->get();

        // Filtrer les services disponibles (ceux qui ne sont pas déjà affectés à l'étudiant)
        $availableServices = $levelServices->diff($attachedServices);

        // Créez un tableau pour stocker les services disponibles avec leurs prix
        $servicesWithPrices = [];

        foreach ($availableServices as $service) {
            // Récupérez le prix du service pour le niveau spécifié
            $price = $service->levels->where('id', $levelId)->first()->pivot->price;

            // Ajoutez le service et son prix au tableau
            $servicesWithPrices[] = [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $price,
            ];
        }

        return response()->json($servicesWithPrices);
    }

    public function getServiceCount(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');
        $serviceCount = Service::where('school_id', $schoolId)
            ->where('year_id', $selectedYear)->count();

        return response()->json(['serviceCount' => $serviceCount]);
    }







}