<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\ApiTestCase;
use App\User;

class UserControllerTest extends ApiTestCase
{
    use DatabaseMigrations;

    private $endpoint;

    public function setUp()
    {   
        parent::setUp();
        $this->endpoint = $this->api . '/users';
    }

    public function tearDown()
    {
        parent::tearDown();
    }

    /** @test **/
    public function get_user_should_return_a_valid_user()
    {
        // retrieve user
        $response = $this->get($this->endpoint . '/' . $this->user->id);
        $response->assertStatus(200);
        
        $avatar_uri = config('filesystems.disks.public.url') . '/' . config('app.public_resources.avatars');
        
        // check some user key data
        $response->assertJsonFragment([
            'id' => $this->user->id,
            'username' => $this->user->username,
            'fullname' => $this->user->fullname,
            'email' => $this->user->email,
            'image' => $avatar_uri . '/' . $this->user->image
        ]);

        // check if dates were populated
        $data = json_decode($response->getContent(), true);
        $this->assertNotEmpty($data['data']['updated_at']);
    }

    /** @test **/
    public function get_user_should_fail_when_the_user_id_does_not_exist()
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
    public function get_user_numeric_id_should_not_match_a_string()
    {
        // passing a string instead of int should redirect somewhere
        $response = $this->get($this->endpoint . '/invalid-id');

        $this->assertEquals(404, $response->status());
    }
    
    /** @test **/
    public function store_should_save_new_user_in_the_database()
    {
        // make a new user (not storing it in DB)
        $user = factory(User::class)->make([
            'fullname' => 'John Doe'
        ]);

        // post it
        $this->post($this->endpoint, [
            'fullname' => $user->fullname,
            'username' => $user->username,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password
            ], ['Accept' => 'application/json']);

        // check in DB
        $this->assertDatabaseHas('users', ['fullname' => 'John Doe']);
    }
    
    /** @test */
    public function store_should_respond_with_a_201_and_location_header_when_successful()
    {
        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // post it
        $response = $this->post($this->endpoint, [
            'username' => $user->username,
            'fullname' => $user->fullname,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password
            ], ['Accept' => 'application/json']);

        $response->assertStatus(201);
    }

    /** @test **/
    public function update_should_change_user_info()
    {
    
        // assure the user name is not this
        $this->assertDatabaseMissing('users', [
            'fullname' => 'Saint Jorge III'
        ]);

        sleep(1); // wait one second to force dates to differ
        
        // update user record
        $response = $this->put($this->endpoint . '/' . $this->user->id, [
            'fullname' => 'Saint Jorge III'
            ], ['Accept' => 'application/json']);
        $response->assertStatus(204);

        // retrieve user data and check the new name
        $response = $this->get($this->endpoint . '/' . $this->user->id);
                
        $response->assertJsonFragment([
            'id' => $this->user->id,
            'fullname' => 'Saint Jorge III'
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
                'fullname' => 'Saint Jorge IV'
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
            'fullname' => 'Saint Jorge IV'
            ], ['Accept' => 'application/json']);

        $this->assertEquals(404, $response->status());
    }

    /** @test **/
    public function delete_should_remove_the_user()
    {
      
        // make sure it exists in DB
        $this->assertDatabaseHas('users', ['id' => $this->user->id]);
        
        // DELETE it
        $response = $this->delete($this->endpoint . '/' . $this->user->id);
        
        $response->assertStatus(204);
        
        // assure it's soft deleted
        $instance = User::withTrashed()->find($this->user->id);
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
