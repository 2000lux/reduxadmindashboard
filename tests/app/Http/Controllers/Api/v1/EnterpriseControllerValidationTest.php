<?php
namespace Tests\App\Http\Controllers\Api\v1;

use App\Enterprise;
use App\Province;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\HttpFoundation\Response;
use Tests\ApiTestCase;

class EnterpriseControllerValidationTest extends ApiTestCase
{
  use DatabaseMigrations;
    
    private $endpoint;

    public function setUp()
    {
        parent::setUp();
        $this->endpoint = $this->api . '/enterprises';
    }
    
    /** @test **/
    public function it_validates_required_fields_when_creating_a_new_record()
    {

        // send empty request
        $response = $this->post($this->endpoint, [], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the list of required fields
        $this->assertArrayHasKey('legal_name', $data);
        $this->assertArrayHasKey('cuit', $data);
        $this->assertArrayHasKey('country_id', $data);
        $this->assertArrayHasKey('province_id', $data);
        $this->assertArrayHasKey('town', $data);
        $this->assertArrayHasKey('phone', $data);
        $this->assertArrayHasKey('client_type', $data);
    }
    
    /** @test **/
    public function it_filters_malicious_code_when_creating_a_new_record()
    {

        // make a new record (not storing it in DB)
        $model = factory(Enterprise::class)->make();

        $province = Province::all()->random();
        
        // store it
        $response = $this->post($this->endpoint, [
            'legal_name' => "<script>alert('hello world')</script>", // <- oh oh code
            'cuit' => "<script>alert('hello world')</script>", // <- oh oh code
            'country_id' => $province->country_id,
            'province_id' => $province->id,
            'town' => "<script>alert('hello world')</script>", // <- oh oh code
            'address' => "<script>alert('hello world')</script>", // <- oh oh code
            'phone' => "<script>alert('hello world')</script>", // <- oh oh code
            'observations' => "<script>alert('hello world')</script>", // <- oh oh code
            'client_type' => 'cliente'
            ], ['Accept' => 'application/json']);
        
        // response is ok
        $response->assertStatus(422);
        
        // assure these fields are not present
        $this->assertDatabaseMissing('enterprises', [
            'legal_name' => "<script>alert('hello world')</script>",
            'cuit' => "<script>alert('hello world')</script>",
            'town' => "<script>alert('hello world')</script>",
            'address' => "<script>alert('hello world')</script>",
            'phone' => "<script>alert('hello world')</script>",
            'observations' => "<script>alert('hello world')</script>"
        ]);
    }
    
    /** @test **/
    public function it_prevents_duplicate_fields_when_creating_a_new_record()
    {

        // create a new record in DB
        $model = factory(Enterprise::class)->create();

        // store it
        $response = $this->post($this->endpoint, $model->toArray(), 
            ['Accept' => 'application/json']);

        // status code must be 422 Unprocessable
        $response->assertStatus(422);

        $data = json_decode($response->getContent(), true);

        // email must be in the duplicated fields list
        $this->assertArrayHasKey('legal_name', $data);
        $this->assertArrayHasKey('cuit', $data);
    }
    
    /** @test **/
    public function it_validates_required_fields_when_updating_a_record()
    {
        
        // create a new record in DB
        $model = factory(Enterprise::class)->create();

        // empty data
        $response = $this->put($this->endpoint . '/' . $model->id, [], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(400, $response->getStatusCode());
    }
    
    /** @test **/
    public function it_validates_unique_fields_are_not_duplicated_when_updating_a_record()
    {
        // create a new record in DB
        $model = factory(Enterprise::class)->create();

        $response = $this->put($this->endpoint . '/' . $model->id, [
            'legal_name' => $model->legal_name, // <- this value is already in use
            'cuit' => $model->cuit // <- this value is already in use
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('legal_name', $data);
        $this->assertArrayHasKey('cuit', $data);
    }
    
    /** @test **/
    public function it_filters_malicious_code_when_updating_a_record()
    {
        // create a new record in DB
        $model = factory(Enterprise::class)->create();
        
        // update with malicious code
        $response = $this->put($this->endpoint . '/' . $model->id, [
            'legal_name' => "<script>alert('hello world')</script>", // <- oh oh code
            'cuit' => "<b>hello</b>", // <- oh oh code
            'town' => "<script>alert('hello world')</script>", // <- oh oh code
            'address' => "<script>alert('hello world')</script>", // <- oh oh code
            'phone' => "<script>alert('hello world')</script>", // <- oh oh code
            'observations' => "<script>alert('hello world')</script>", // <- oh oh code
            ], ['Accept' => 'application/json']);

        // response is ok
        $response->assertStatus(204);

        // assure these fields doesn't contain malicious code
        $this->assertDatabaseMissing('enterprises', [
            'legal_name' => "<script>alert('hello world')</script>",
            'cuit' => "<script>alert('hello world')</script>",
            'town' => "<script>alert('hello world')</script>",
            'address' => "<script>alert('hello world')</script>",
            'phone' => "<script>alert('hello world')</script>",
            'observations' => "<script>alert('hello world')</script>"
        ]);
    }
}
