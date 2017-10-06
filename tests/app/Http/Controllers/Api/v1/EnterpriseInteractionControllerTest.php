<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\ApiTestCase;
use App\Interaction;
use \App\Enterprise;

class EnterpriseInteractionControllerTest extends ApiTestCase
{
    use DatabaseMigrations;

    private $endpoint;

    private $faker;
    
    public function setUp()
    {   
        parent::setUp();
        $this->endpoint = $this->api . '/enterprises/%s/interactions';
        $this->faker = \Faker\Factory::create();
    }

    public function tearDown()
    {
        parent::tearDown();
    }
    
    private function formatEndpoint($enterprise_id, $interaction_id = null)
    {
        return sprintf($this->endpoint, $enterprise_id) . '/' . $interaction_id;
    }
    
    private function getEnterpriseInteraction() {
                
        return Interaction::with([
                'contact' => function($query) {
                    $query->select('contacts.id', 'fullname', 'position');
                }, 
                'contact.enterprises' => function($query) {
                    $query->select('contact_enterprise.enterprise_id');
                }
                ])         
                ->first();
    }
    
    /** @test **/
    public function get_interactions_should_return_json_list()
    {
        
        $enterprise = Enterprise::first();
        
        // retrieve user
        $response = $this->get( $this->formatEndpoint($enterprise->id) );
        $response->assertStatus(200);        
    }

    /** @test **/
    public function get_interaction_should_return_a_valid_entry()
    {
        
        $interaction = $this->getEnterpriseInteraction();
        $enterprise_id = $interaction->contact->enterprises[0]->enterprise_id;
  
        // retrieve user
        $response = $this->get( $this->formatEndpoint($enterprise_id, $interaction->id) );
        $response->assertStatus(200);
        
        // check some key data
        $response->assertJsonFragment([
            'id' => $interaction->id,
            'description' => $interaction->description,
            'contact' => [
                'enterprises' => [
                    ['enterprise_id' => $enterprise_id]
                ],
                'fullname' => $interaction->contact->fullname,
                'id' => $interaction->contact->id,
                'position' => $interaction->contact->position
            ]
        ]);        
    }

    /** @test **/
    public function get_interaction_should_fail_when_the_id_does_not_exist()
    {
        
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        $enterprise = Enterprise::first();
        
        // using a big number to make it fail
        $response = $this->get( 
            $this->formatEndpoint($enterprise->id, '999999999999999'), 
            ['Accept' => 'application/json']);
        $response->assertStatus(404);
        
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }

    /** @test **/
    public function get_interaction_numeric_id_should_not_match_a_string()
    {
        $enterprise = Enterprise::first();
        
        // passing a string instead of int should redirect somewhere
        $response = $this->get( $this->formatEndpoint($enterprise->id, 'invalid-id') );

        $this->assertEquals(404, $response->status());
    }    
}
