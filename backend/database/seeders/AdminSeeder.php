<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@foodiekart.com'],
            [
                'full_name' => 'Admin Staff',
                'email' => 'admin@foodiekart.com',
                'password' => 'password',
                'phone_number' => '09000000000',
                'role' => 'admin',
            ]
        );
    }
}
