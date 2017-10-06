<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{

    public function run()
    {
        $role_employee = new Role();
        $role_employee->name = 'employee';
        $role_employee->description = 'Empleado';
        $role_employee->save();
        
        $role_manager = new Role();
        $role_manager->name = 'manager';
        $role_manager->description = 'Gerente';
        $role_manager->save();
    }
}
