<?php

namespace Database\Seeders;

use App\Models\Year;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class YearsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Year::create([
            'id' => 1,
            'name' => '2023-2024',
            'start_date' => '2023-08-01',
            'end_date' => '2024-09-30',
        ]);
    }
}