<?php

namespace Database\Seeders;

use App\Models\Pack;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PacksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Pack::create([
            'name' => 'none',
            'price' => 0.0,
            'duration' => 0,
            'year_id' => 1,
        ]);

    }
}