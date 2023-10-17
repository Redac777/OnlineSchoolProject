<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        School::create([
            'name' => 'Online School',
            'city' => 'National',
            'manager' => 'Admin Platform',
            'address' => 'Undefined',
            'phone' => 'Undefined',
            'logo' => 'Undefined',
            'pack_id' => 1,
            'year_id' => 1,
        ]);
    }
}