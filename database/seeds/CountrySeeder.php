<?php

use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('provinces')->delete();
        DB::table('countries')->delete();
        
        factory(App\Country::class, 8)->create()->each(function($country){
            factory(App\Province::class, rand(4, 6))->create([
                'country_id' => $country->id
            ]);
        });
    }
}
