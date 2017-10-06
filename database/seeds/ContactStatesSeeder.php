<?php

use Illuminate\Database\Seeder;

class ContactStatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contact_states')->delete();
        
        $states = [
            'activo' => 'Activo', 
            'reemplazado' => 'Reemplazado', 
            'trasladado' => 'Trasladado', 
            'baja' => 'Baja'
            ];
        
        foreach ($states as $key => $state) {
            
            App\ContactState::create(array(
                'keyname' => $key,
                'name' => $state
            ));
        }       
    }
}
