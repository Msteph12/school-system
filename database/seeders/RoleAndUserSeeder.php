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

        User::firstOrCreate(
            ['email' => 'admin@school.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $roleIds['admin'],
            ]
        );

        User::firstOrCreate(
            ['email' => 'registrar@school.com'],
            [
                'name' => 'Registrar User',
                'password' => Hash::make('password'),
                'role_id' => $roleIds['registrar'],
            ]
        );

        User::firstOrCreate(
            ['email' => 'teacher@school.com'],
            [
                'name' => 'Teacher User',
                'password' => Hash::make('password'),
                'role_id' => $roleIds['teacher'],
            ]
        );

        User::firstOrCreate(
            ['email' => 'student@school.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'role_id' => $roleIds['student'],
            ]
        );

        User::firstOrCreate(
            ['email' => 'accountant@school.com'],
            [
                'name' => 'Accountant User',
                'password' => Hash::make('password'),
                'role_id' => $roleIds['accountant'],
            ]
        );

    }
}
