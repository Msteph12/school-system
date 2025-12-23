<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin',
            'registrar',
            'teacher',
            'student',
            'accountant',
        ];

        $roleIds = [];

        foreach ($roles as $role) {
            $roleIds[$role] = Role::firstOrCreate([
                'name' => $role
            ])->id;
        }

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role_id' => $roleIds['admin'],
        ]);

        User::create([
            'name' => 'Registrar User',
            'email' => 'registrar@school.com',
            'password' => Hash::make('password'),
            'role_id' => $roleIds['registrar'],
        ]);

        User::create([
            'name' => 'Teacher User',
            'email' => 'teacher@school.com',
            'password' => Hash::make('password'),
            'role_id' => $roleIds['teacher'],
        ]);

        User::create([
            'name' => 'Student User',
            'email' => 'student@school.com',
            'password' => Hash::make('password'),
            'role_id' => $roleIds['student'],
        ]);

        User::create([
            'name' => 'Accountant User',
            'email' => 'accountant@school.com',
            'password' => Hash::make('password'),
            'role_id' => $roleIds['accountant'],
        ]);
    }
}
