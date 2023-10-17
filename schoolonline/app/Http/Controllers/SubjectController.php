<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    //
    public function listSubjects(Request $request)
    {
        $levelId = $request->input('level'); // Get the level ID from the request
        $selectedYear = $request->input('selectedYear');
        $schoolId = $request->input('school');
        $query = Subject::query();

        if ($levelId) {
            $query->whereHas('levels', function ($q) use ($levelId) {
                $q->where('levels.id', $levelId);
            });
            if ($selectedYear) {
                $query->where('year_id', $selectedYear);
            }

            $query->with([
                'levels' => function ($q) use ($levelId) {
                    $q->where('levels.id', $levelId);
                }
            ]);
        } else {
            $query->with('levels')->where('year_id', $selectedYear); // Load all levels for all subjects
        }

        $subjects = $query->where('school_id', $schoolId)->get();

        return response()->json($subjects);
    }

    public function createSubject(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'coefficients' => 'required|string',
            // Validate coefficients as an array
            'coefficients.*' => 'numeric|min:1',
            // Validate each coefficient
            'school_id' => 'required',
            'levels' => 'required|array',
            'levels.*' => 'exists:levels,id',
            'year_id' => 'nullable',
        ]);

        try {
            // Create the subject


            $subject = new Subject();
            $subject->name = $request->input('name');
            $subject->school_id = $request->input('school_id');
            $subject->year_id = $request->input('year_id');
            $subject->save();

            // Calculate the number of levels and coefficients
            $selectedLevels = $request->input('levels');
            $coefficients = explode(',', $request->input('coefficients'));
            $lastCoefficient = array_pop($coefficients);
            if (count($selectedLevels) == 12)
                $selectedLevels = array_reverse($selectedLevels);
            foreach ($selectedLevels as $levelId) {
                $coefficient = array_shift($coefficients) ?? $lastCoefficient;

                // Attach the level with its coefficient
                $subject->levels()->attach([$levelId => ['coefficient' => $coefficient]]);
            }



            return response()->json(['success' => true], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }

    public function detachLevelFromSubject($subjectId, $levelId)
    {
        try {
            $subject = Subject::findOrFail($subjectId);
            $subject->levels()->detach($levelId);
            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }

    public function deleteSubject($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }

    public function updateSubjectCoefficients(Request $request, Subject $subject)
    {
        $coefficients = $request->input('coefficients');

        try {
            foreach ($coefficients as $levelId => $coefficient) {
                // Validate and update the coefficient if the level is associated with the subject
                $subject->levels()->updateExistingPivot($levelId, ['coefficient' => $coefficient]);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false], 500);
        }
    }

    public function updateSubject(Request $request, $id)
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->name = $request->input('name');
        $subject->save();

        return response()->json(['message' => 'Subject updated successfully']);
    }



}