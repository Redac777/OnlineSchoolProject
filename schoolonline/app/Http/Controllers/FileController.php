<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class FileController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $uploadedFile = $request->file('image');
            $filePath = $uploadedFile->store('uploads', 'public');
            $file = new File();
            $file->file_path = $filePath;
            $file->file_type = $uploadedFile->getClientOriginalExtension();
            $file->save();
            return response()->json(['file' => $file]);
        }


        return response()->json(['error' => 'Aucune image n\'a été téléchargée.'], 400);
    }
}