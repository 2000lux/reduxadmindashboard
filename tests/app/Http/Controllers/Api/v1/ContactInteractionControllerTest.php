<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\ApiTestCase;
use App\Interaction;
use \App\Enterprise;

class ContactInteractionControllerTest extends ApiTestCase
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
                }])         
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
        $enterprise = $interaction->contact->enterprises[0];
      
        // retrieve user
        $response = $this->get( $this->formatEndpoint($enterprise->id, $interaction->id) );
        $response->assertStatus(200);
        
        // check some key data
        $response->assertJsonFragment([
            'id' => $interaction->id,
            'description' => $interaction->description,
            'contact' => [
                'id' => $interaction->contact->id,
                'fullname' => $interaction->contact->fullname,
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
    
    /** @test **/
    public function store_should_save_new_record_in_the_database()
    {
       
        $description = $this->faker->sentence(12);
        $date = Carbon\Carbon::now();
        
        // make a new item (not storing it in DB)
        $interaction = factory(Interaction::class)->make([
            'description' => $description,
            'created_at'=> $date
        ]);
        
        // post it        
        $response = $this->post($this->formatEndpoint($interaction->enterprise_id), $interaction->toArray(), 
            ['Accept' => 'application/json']);
        
        // check in DB
        $this->assertDatabaseHas('interactions', [
            'description' => $description,
            'created_at' => $date,
            ]);
    }
    
    /** @test */
    public function store_should_respond_with_a_201_and_location_header_when_successful()
    {
        // make a new item (not storing it in DB)
        $interaction = factory(Interaction::class)->make();

        // post it
        $response = $this->post($this->formatEndpoint($interaction->enterprise_id), $interaction->toArray(), 
            ['Accept' => 'application/json']);

        $response->assertStatus(201);
    }

    /** @test **/
    public function update_should_change_current_info()
    {
    
        // reference description
        $description = $this->faker->sentence(12);
        $updated_at = Carbon\Carbon::now();
        
        // create an item
        $interaction = factory(Interaction::class)->create();
        
        // assure the description is not this
        $this->assertDatabaseMissing('interactions', [
            'description' => $description
        ]);

        sleep(1); // wait one second to force dates to differ
        
        // update record
        /**
         * @var Response $response
         */
        $response = $this->put($this->formatEndpoint($interaction->enterprise_id, $interaction->id), [
            'description' => $description,
            'updated_at' => $updated_at
            ], ['Accept' => 'application/json']);
       
        $response->assertStatus(204);

        // retrieve data and check the new description
        $response = $this->get($this->formatEndpoint($interaction->enterprise_id, $interaction->id));
                
        $response->assertJsonFragment([
            'id' => $interaction->id,
            'description' => $description,
            'updated_at' => $updated_at
        ]);

        $response->assertStatus(200);
    }

    /** @test * */
    public function update_should_fail_with_an_invalid_id()
    {
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        $enterprise = Enterprise::first();
        
        // try a really high number
        $response = $this->put( $this->formatEndpoint($enterprise->id, '999999999999999') , [
                'description' => $this->faker->sentence(12)
                ], ['Accept' => 'application/json']);

        $response->assertStatus(404);
        
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }

    /** @test **/
    public function update_numeric_id_should_not_match_a_string()
    {
        $enterprise = Enterprise::first();
        
        $response = $this->put( $this->formatEndpoint($enterprise->id, 'invalid-id'), [
            'description' => $this->faker->sentence(12)
            ], ['Accept' => 'application/json']);

        $this->assertEquals(404, $response->status());
    }

    /** @test **/
    public function delete_should_remove_the_record_from_DB()
    {
        
        // create an item
        $interaction = factory(Interaction::class)->create();
      
        // make sure it exists in DB
        $this->assertDatabaseHas('interactions', ['id' => $interaction->id]);
        
        // DELETE it
        $response = $this->delete( $this->formatEndpoint($interaction->enterprise_id, $interaction->id) );
        
        $response->assertStatus(204);
        
        // assure it's soft deleted
        $instance = Interaction::withTrashed()->find($interaction->id);
        $this->assertContains('deleted_at', $instance->getDates());
    }
    
    /** @test **/
    public function delete_should_return_a_404_with_an_invalid_id()
    {
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        $enterprise = Enterprise::first();
        
        // try with a really high number
        $response = $this->delete( $this->formatEndpoint($enterprise->id, '999999999999999') );        
        $response->assertStatus(404);
                
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }
    
    /** @test **/
    public function delete_numeric_id_should_not_match_a_string()
    {
        $interaction = factory(Interaction::class)->create();
       
        $response = $this->delete( $this->formatEndpoint($interaction->enterprise_id, 'invalid-id' ) );
        
        $response->assertStatus(404);
    }
}
