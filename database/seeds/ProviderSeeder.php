<?php

use App\Contact;
use App\Email;
use App\Interaction;
use App\Provider;
use Illuminate\Database\QueryException;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('providers')->delete();
        
        try {
            
            // create some providers
            $providers = factory(Provider::class, 14)->create();
            $providers->each(function($provider) {

                $this->createContacts($provider);                
            });
        } catch (QueryException $ex) {
            var_dump($ex->getMessage());
        }
    }
    
    private function createContacts($provider) {
        
        $contacts = factory(Contact::class, rand(3, 5))->create(); // create contacts
    
        $contacts->each(function($contact) use ($provider) {

            $provider->contacts()->attach($contact); // assign contacts to enterprise
            
            factory(Interaction::class, rand(5, 12))->create(['contact_id' => $contact->id]);
            factory(Email::class, rand(1, 3))->create(['contact_id' => $contact->id]);
        });         
    }
}
