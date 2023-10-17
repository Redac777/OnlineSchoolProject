<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'user_type' => 'admin-platform',
            'code' => 'ML0101010101',
            'password' => bcrypt('P@ssw0rd'),
            'username' => 'redacedd',
            'lastName' => 'Chemseddine',
            'firstName' => 'Reda',
            'gender' => 'male',
            'birthDay' => '2001-08-22',
            'email' => 'chemseddinereda7@email.com',
            'userProfil' => 'reda_profile.png',
            'address' => 'address1',
            'phone' => 'phone3444',
            'school_id' => 1,
            'year_id' => 1,

        ]);

        // Vous pouvez ajouter plus d'utilisateurs ici si nécessaire
    }
}