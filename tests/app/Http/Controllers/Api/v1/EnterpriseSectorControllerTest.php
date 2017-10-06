<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\ApiTestCase;
use App\Sector;
use \App\Enterprise;

class EnterpriseSectorControllerTest extends ApiTestCase
{
    use DatabaseMigrations;

    private $endpoint;

    public function setUp()
    {   
        parent::setUp();
        $this->endpoint = $this->api . '/enterprises/%s/sectors';
    }

    public function tearDown()
    {
        parent::tearDown();
    }
    
    private function formatEndpoint($enterprise_id, $sector_id = null)
    {
        return sprintf($this->endpoint, $enterprise_id) . '/' . $sector_id;
    }
    
    /** @test **/
    public function get_sectors_should_return_json_list()
    {
        
        $enterprise = Enterprise::first();
        
        // retrieve user
        $response = $this->get( $this->formatEndpoint($enterprise->id) );
        $response->assertStatus(200);        
    }

    /** @test **/
    public function get_sector_should_return_a_valid_entry()
    {
        
        $enterprise = Enterprise::first();
        $sector = $enterprise->sectors()->first();
        
        // retrieve user
        $response = $this->get( $this->formatEndpoint($enterprise->id, $sector->id) );
        $response->assertStatus(200);
        
        // check some key data
        $response->assertJsonFragment([
            'id' => $sector->id,
            'name' => $sector->name
        ]);
    }

    /** @test **/
    public function get_sector_should_fail_when_the_id_does_not_exist()
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
    public function get_sector_numeric_id_should_not_match_a_string()
    {
        $enterprise = Enterprise::first();
        
        // passing a string instead of int should redirect somewhere
        $response = $this->get( $this->formatEndpoint($enterprise->id, 'invalid-id') );

        $this->assertEquals(404, $response->status());
    }
    
    /** @test **/
    public function store_should_save_new_record_in_the_database()
    {
        $name = 'Nursery High';
        
        // make a new item (not storing it in DB)
        $sector = factory(Sector::class)->make([
            'name' => $name
        ]);
        
        // post it        
        $response = $this->post($this->formatEndpoint($sector->enterprise_id), $sector->toArray(), 
            ['Accept' => 'application/json']);
        
        // check in DB
        $this->assertDatabaseHas('sectors', ['name' => $name]);
    }
    
    /** @test */
    public function store_should_respond_with_a_201_and_location_header_when_successful()
    {
        // make a new item (not storing it in DB)
        $sector = factory(Sector::class)->make();

        // post it
        $response = $this->post($this->formatEndpoint($sector->enterprise_id), $sector->toArray(), 
            ['Accept' => 'application/json']);

        $response->assertStatus(201);
    }

    /** @test **/
    public function update_should_change_current_info()
    {
    
        // reference name
        $name = 'Fiction and Joy Department';
        
        // create an item
        $sector = factory(Sector::class)->create();
        
        // assure the name is not this
        $this->assertDatabaseMissing('sectors', [
            'name' => $name
        ]);

        sleep(1); // wait one second to force dates to differ
        
        // update record
        /**
         * @var Response $response
         */
        $response = $this->put($this->formatEndpoint($sector->enterprise_id, $sector->id), [
            'name' => $name
            ], ['Accept' => 'application/json']);
       
        $response->assertStatus(204);

        // retrieve data and check the new name
        $response = $this->get($this->formatEndpoint($sector->enterprise_id, $sector->id));
                
        $response->assertJsonFragment([
            'id' => $sector->id,
            'name' => $name
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
                'name' => 'Fiction and Joy Division'
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
            'name' => 'Joy Division'
            ], ['Accept' => 'application/json']);

        $this->assertEquals(404, $response->status());
    }

    /** @test **/
    public function delete_should_remove_the_record_from_DB()
    {
        
        // create an item
        $sector = factory(Sector::class)->create();
      
        // make sure it exists in DB
        $this->assertDatabaseHas('sectors', ['id' => $sector->id]);
        
        // DELETE it
        $response = $this->delete( $this->formatEndpoint($sector->enterprise_id, $sector->id) );
        
        $response->assertStatus(204);
        
        // assure it's not is soft deleted
        $instance = Sector::withTrashed()->find($sector->id);
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
        $sector = factory(Sector::class)->create();
       
        $response = $this->delete( $this->formatEndpoint($sector->enterprise_id, 'invalid-id' ) );
        
        $response->assertStatus(404);
    }
}
