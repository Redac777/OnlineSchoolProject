<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class DashboardController extends Controller
{



    public function admin()
    {
        // ... your logic
        return Inertia::render('AdminDashboard');
    }

    public function user()
    {
        // ... your logic
        return Inertia::render('UserDashboard');
    }
}