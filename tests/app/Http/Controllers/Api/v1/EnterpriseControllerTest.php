<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\ApiTestCase;
use App\Enterprise;

class EnterpriseControllerTest extends ApiTestCase
{
    use DatabaseMigrations;

    private $endpoint;

    public function setUp()
    {   
        parent::setUp();
        $this->endpoint = $this->api . '/enterprises';
    }

    public function tearDown()
    {
        parent::tearDown();
    }

    /** @test **/
    public function get_enterprise_should_return_a_valid_enterprise()
    {
        
        $enterprise = Enterprise::first();
        
        // retrieve user
        $response = $this->get($this->endpoint . '/' . $enterprise->id);
        $response->assertStatus(200);
        
        // check some key data
        $response->assertJsonFragment([
            'id' => $enterprise->id,
            'legal_name' => $enterprise->legal_name,
            'cuit' => $enterprise->cuit,
            'country' => [
                'code' => $enterprise->country->code,
                'id' => $enterprise->country->id,
                'name' => $enterprise->country->name
            ],
            'client_type' => $enterprise->client_type
        ]);
    }

    /** @test **/
    public function get_enterprise_should_fail_when_the_enterprise_id_does_not_exist()
    {
        
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        // using a big number to make it fail
        $response = $this->get($this->endpoint . '/999999999999999', ['Accept' => 'application/json']);
        $response->assertStatus(404);
        
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }

    /** @test **/
    public function get_enterprise_numeric_id_should_not_match_a_string()
    {
        // passing a string instead of int should redirect somewhere
        $response = $this->get($this->endpoint . '/invalid-id');

        $this->assertEquals(404, $response->status());
    }
    
    /** @test **/
    public function store_should_save_new_enterprise_in_the_database()
    {
        $legal_name = 'John Doe Inc';
        
        // make a new item (not storing it in DB)
        $model = factory(Enterprise::class)->make([
            'legal_name' => $legal_name
        ]);
        
        // post it        
        $response = $this->post($this->endpoint, $model->toArray(), 
            ['Accept' => 'application/json']);
        
        // check in DB
        $this->assertDatabaseHas('enterprises', ['legal_name' => $legal_name]);
    }
    
    /** @test */
    public function store_should_respond_with_a_201_and_location_header_when_successful()
    {
        // make a new item (not storing it in DB)
        $model = factory(Enterprise::class)->make();

        // post it
        $response = $this->post($this->endpoint, $model->toArray(), 
            ['Accept' => 'application/json']);

        $response->assertStatus(201);
    }

    /** @test **/
    public function update_should_change_enterprise_info()
    {
    
        // reference name
        $name = 'Saint Jorge Fiction Company';
        
        // create an item
        $enterprise = factory(Enterprise::class)->create();
        
        // assure the name is not this
        $this->assertDatabaseMissing('enterprises', [
            'legal_name' => $name
        ]);

        sleep(1); // wait one second to force dates to differ
        
        // update record
        /**
         * @var Response $response
         */
        $response = $this->put($this->endpoint . '/' . $enterprise->id, [
            'legal_name' => $name
            ], ['Accept' => 'application/json']);
       
        $response->assertStatus(204);

        // retrieve data and check the new name
        $response = $this->get($this->endpoint . '/' . $enterprise->id);
                
        $response->assertJsonFragment([
            'id' => $enterprise->id,
            'legal_name' => $name
        ]);

        $response->assertStatus(200);
    }

    /** @test * */
    public function update_should_fail_with_an_invalid_id()
    {
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        // try a really high number
        $response = $this->put($this->endpoint . '/999999999999999', [
                'legal_name' => 'Saint Jorge Fiction Company'
                ], ['Accept' => 'application/json']);

        $response->assertStatus(404);
        
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }

    /** @test **/
    public function update_numeric_id_should_not_match_a_string()
    {
        $response = $this->put($this->endpoint . '/invalid-id', [
            'legal_name' => 'Saint Jorge Fiction Company'
            ], ['Accept' => 'application/json']);

        $this->assertEquals(404, $response->status());
    }

    /** @test **/
    public function delete_should_remove_the_enterprise()
    {
        
        // create an item
        $enterprise = factory(Enterprise::class)->create();
      
        // make sure it exists in DB
        $this->assertDatabaseHas('enterprises', ['id' => $enterprise->id]);
        
        // DELETE it
        $response = $this->delete($this->endpoint . '/' . $enterprise->id);
        
        $response->assertStatus(204);
        
        // assure it's soft deleted
        $instance = Enterprise::withTrashed()->find($enterprise->id);
        $this->assertContains('deleted_at', $instance->getDates());
    }
    
    /** @test **/
    public function delete_should_return_a_404_with_an_invalid_id()
    {
        // disable auth since the id doesn't exist
        $this->disableAuth();
        
        // try with a really high number
        $response = $this->delete($this->endpoint . '/999999999999999');        
        $response->assertStatus(404);
                
        // check if there's a json message in response
        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('error', $data);
    }
    
    /** @test **/
    public function delete_numeric_id_should_not_match_a_string()
    {
        $response = $this->delete($this->endpoint . '/invalid-id');
        
        $this->assertEquals(404, $response->status());
    }
}
