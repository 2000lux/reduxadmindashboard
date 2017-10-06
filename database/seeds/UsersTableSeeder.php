<?php

use App\User;
use App\Role;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('users')->delete();
        
        $role_manager  = Role::where('name', 'manager')->first();
        $role_employee = Role::where('name', 'employee')->first();
        
        $user = User::create(array(
            'fullname' => 'Alejo Constante',
            'username' => 'admin',
            'email' => 'alejo@constante.net',
            'password' => Hash::make('admin'),
            'image'=> 'default_image.png',
            'created_at'=> Carbon::now(),
            'updated_at'=> Carbon::now()
        ));
        
        $employee = User::create(array(
            'fullname' => 'Carlos Fuentes',
            'username' => 'employee',
            'email' => 'carlos@fuentes.net',
            'password' => Hash::make('employee'),
            'image'=> 'default_image.png',
            'created_at'=> Carbon::now(),
            'updated_at'=> Carbon::now()
        ));
        
        $user->roles()->attach($role_manager);
        $employee->roles()->attach($role_employee);
        
        $users = factory(User::class, 12)->create(); // some more
        $users->each(function($employee) use ($role_employee) {
            $employee->roles()->attach($role_employee);
        });
    }
}
