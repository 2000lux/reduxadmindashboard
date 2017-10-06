<?php

use App\Enterprise;
use App\Web;
use App\Email;
use App\Interaction;
use App\Sector;
use App\Contact;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EnterpriseSeeder extends Seeder
{
    public function run()
    {
        
        DB::table('webs')->delete();
        DB::table('interactions')->delete();
        DB::table('emails')->delete();
        DB::table('contacts')->delete();
        DB::table('sectors')->delete();
        DB::table('enterprises')->delete();
        
        try {
            
            $faker = Faker::create();
            
            // create some enterprises
            $enterprises = factory(Enterprise::class, 14)->create();
            $enterprises->each(function($enterprise) use($faker) {

                $sectors = factory(Sector::class, rand(2, 4))->create([
                    'enterprise_id' => $enterprise->id
                ]); // create sectors

                $sectors->each(function($sector) use ($enterprise) {
                    $this->createContacts($enterprise, $sector);
                });   
                
                // webs               
                Web::create([
                    'type' => 'invoice',
                    'link'=> $faker->url,
                    'user'=> $faker->userName,
                    'password'=> $faker->password,
                    'enterprise_id'=> $enterprise->id,
                ]);
                
                Web::create([
                    'type' => 'bidding',
                    'link'=> $faker->url,
                    'user'=> $faker->userName,
                    'password'=> $faker->password,
                    'enterprise_id'=> $enterprise->id,
                ]);
            });

        } catch (\Illuminate\Database\QueryException $ex) {
            $error_code = $ex->errorInfo[1];
            if($error_code == 1062){
                print ('Skipping duplicated entry');
            }
        }
    }
    
    private function createContacts($enterprise, $sector) {
        
        $contacts = factory(Contact::class, rand(2, 5))->create(); // create contacts
    
        $contacts->each(function($contact) use ($enterprise, $sector) {

            $state = rand(1, 4); // random state
            
            $enterprise->contacts()->attach($contact->id, ['state_id'=> $state]); // assign contacts to enterprise
            $sector->contacts()->attach($contact);   // assign contacts to sector  
            
            factory(Interaction::class, rand(5, 12))->create(['contact_id' => $contact->id]);
            factory(Email::class, rand(1, 3))->create(['contact_id' => $contact->id]);
        });         
    }
}
