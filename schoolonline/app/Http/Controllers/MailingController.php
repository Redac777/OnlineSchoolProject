<?php

namespace App\Http\Controllers;

use App\Models\Mailing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MailingController extends Controller
{
    //

    public function index(Request $request)
    {
        $selectedYear = $request->input('selectedYear');
        $unread = $request->input('unread');
        $user = Auth::user(); // Récupérer l'utilisateur connecté

        $query = Mailing::with('sender')
            ->where('recipient_id', $user->id)
            ->where('year_id', $selectedYear)
            ->orderBy('created_at', 'desc');

        if ($unread == true) {
            $query->where('read', false);
        }

        $mails = $query->get();

        return response()->json($mails);
    }





    public function createMailing(Request $request)
    {
        // Validate the input data
        $request->validate([
            'recipient_id' => 'required',
            'content' => 'nullable',
            'subject' => 'required',
            'year_id' => 'nullable',
        ]);

        // Create a new mailing entry
        $mailing = new Mailing();
        $mailing->sender_id = auth()->user()->id;
        $mailing->recipient_id = $request->input('recipient_id');
        $mailing->content = $request->input('content');
        $mailing->subject = $request->input('subject');
        $mailing->year_id = $request->input('year_id');
        $mailing->save();

        // Return a response indicating success
        return response()->json(['message' => 'Mailing created successfully'], 201);
    }

    public function getSenderMessages(Request $request)
    {
        $user = Auth::user(); // Récupérer l'utilisateur connecté
        $selectedYear = $request->input('selectedYear');
        $mails = Mailing::with('recipient') // Charger les informations de l'expéditeur
            ->where('sender_id', $user->id) // Récupérer les e-mails destinés à l'utilisateur connecté
            ->where('year_id', $selectedYear)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($mails);
    }

    public function markMessageAsRead($id)
    {
        $message = Mailing::find($id);

        if ($message) {
            $message->read = true;
            $message->save();
            return response()->json(['message' => 'Message marked as read']);
        }

        return response()->json(['error' => 'Message not found'], 404);
    }


}