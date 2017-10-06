<?php
namespace Tests\App\Http\Controllers\Api\v1;

use Tests\ApiTestCase;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\HttpFoundation\Response;

class UserControllerValidationTest extends ApiTestCase
{
    use DatabaseMigrations;
    
    private $endpoint;

    public function setUp()
    {
        parent::setUp();
        $this->endpoint = $this->api . '/users';
    }
    
    /** @test **/
    public function it_validates_required_fields_when_creating_a_new_user()
    {

        // send empty request
        $response = $this->post($this->endpoint, [], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the list of required fields
        $this->assertArrayHasKey('fullname', $data);
        $this->assertArrayHasKey('username', $data);
        $this->assertArrayHasKey('email', $data);
        $this->assertArrayHasKey('password', $data);
    }
    
    /** @test **/
    public function it_validates_email_is_well_formed_creating_a_new_user()
    {
        
        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // store it
        $response = $this->post($this->endpoint, [
            'fullname' => $user->name,
            'username' => $user->userName,
            'email' => 'fake@email', // <- malformed email
            'password' => $user->password,
            'password_confirmation' => $user->password,
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
      
        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('email', $data);
    }
    
    /** @test **/
    public function passwords_must_match_when_creating_a_new_user()
    {

        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // store it
        $response = $this->post($this->endpoint, [
            'username' => $user->username,
            'fullname' => $user->fullname,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => 'nonsense', // <- a tea pot!
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('password', $data);
    }
    
    /** @test **/
    public function passwords_must_be_at_least_8_chars_when_creating_a_new_user()
    {

        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // store it
        $response = $this->post($this->endpoint, [
            'username' => $user->username,
            'fullname' => $user->fullname,
            'email' => $user->email,
            'password' => 'secret', // <- too short
            'password_confirmation' => 'secret', 
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('password', $data);
    }
    
    /** @test **/
    public function it_filters_out_unwanted_fields_when_creating_a_new_user()
    {

        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // store it
        $response = $this->post($this->endpoint, [
            'username' => $user->username,
            'fullname' => $user->fullname,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'image' => 'http://malicious.site/funnyface.jpg', // <- this field shouldn't pass
            ], ['Accept' => 'application/json']);

        // response is ok
        $response->assertStatus(422);
        
        // assure the user name is not this
        $this->assertDatabaseMissing('users', [
            'image' => 'http://malicious.site/funnyface.jpg'
        ]);
    }
    
    /** @test **/
    public function it_filters_malicious_code_when_creating_a_new_user()
    {

        // make a new user (not storing it in DB)
        $user = factory(User::class)->make();

        // store it
        $response = $this->post($this->endpoint, [
            'username' => "<script>alert('hello world')</script>", // <- oh oh code
            'fullname' => $user->fullname,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password
            ], ['Accept' => 'application/json']);
        
        // response is ok
        $response->assertStatus(422);
        
        // assure the user name is not this
        $this->assertDatabaseMissing('users', [
            'name' => "<script>alert('hello world')</script>"
        ]);
    }
    
    /** @test **/
    public function it_prevents_duplicate_email_when_creating_a_new_user()
    {

        // create a new user in DB
        $user = factory(User::class)->create();

        // store it
        $response = $this->post($this->endpoint, [
            'username' => $user->username,
            'fullname' => $user->fullname,
            'email' => $user->email, // <- duplicated email
            'password' => $user->password,
            'password_confirmation' => $user->password
            ], ['Accept' => 'application/json']);

        // status code must be 422 Unprocessable
        $response->assertStatus(422);

        $data = json_decode($response->getContent(), true);

        // email must be in the duplicated fields list
        $this->assertArrayHasKey('email', $data);
    }
    
    /** @test **/
    public function it_validates_required_fields_when_updating_a_user()
    {

        // empty data
        $response = $this->put($this->endpoint . '/' . $this->user->id, [], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(400, $response->getStatusCode());
    }

    /** @test **/
    public function it_validates_email_is_well_formed_when_updating_a_user()
    {

        // try with a fake email
        $response = $this->put($this->endpoint . '/' . $this->user->id, [
            'email' => 'fake@email'
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('email', $data);
    }

    /** @test **/
    public function it_validates_email_is_not_duplicated_when_updating_a_user()
    {
        // create a new user in DB
        $user1 = $this->createAndBeUser();

        // create another user in DB
        $user2 = $this->createUser();

        $response = $this->put($this->endpoint . '/' . $user1->id, [
            'email' => $user2->email // <- this email is already in use
            ], ['Accept' => 'application/json']);

        // catch error code
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('email', $data);
    }

    /** @test **/
    public function passwords_must_match_when_updating_a_user()
    {

        // mismatching passwords
        $response = $this->put($this->endpoint . '/' . $this->user->id, [
            'password' => 'secret',
            'password_confirmation' => 'broken_secret' // <- this password mismatch
            ], ['Accept' => 'application/json']);

        // catch error
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('password', $data);
    }

    /** @test **/
    public function passwords_must_be_at_least_8_chars_on_update_user()
    {

        // mismatching passwords
        $response = $this->put($this->endpoint . '/' . $this->user->id, [
            'password' => 'secret', // <- too short
            'password_confirmation' => 'secret'
            ], ['Accept' => 'application/json']);

        // catch error
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);

        // inspect the field in the list of unvalid fields
        $this->assertArrayHasKey('password', $data);
    }

    /** @test **/
    public function it_filters_malicious_code_when_updating_a_user()
    {

        // update with malicious code
        $response = $this->put($this->endpoint . '/' . $this->user->id, [
            'fullname' => "<script>alert('hello world')</script>", // <- oh oh code
            ], ['Accept' => 'application/json']);

        // response is ok
        $response->assertStatus(204);

        // assure the user name is not this
        $this->assertDatabaseMissing('users', [
            'fullname' => "<script>alert('hello world')</script>"
        ]);
    }
}
