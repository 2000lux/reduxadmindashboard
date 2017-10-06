<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Gate;

abstract class ApiTestCase extends TestCase
{

    /**
     * endpoint root
     */
    protected $api = '/api/v1';
    
    /**
     * authenticated user
     */
    protected $user = null; 
    
    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }

    /**
     * Setup test defaults
     */
    public function setUp()
    {
        parent::setUp();
        
        Artisan::call('migrate');        
        Artisan::call('db:seed');
        
        // create a new user and be the user to authenticate       
        $this->user = $this->createAndBeUser();
    }

    /**
     * Create user in DB
     * @return App\User
     */
    public function createUser()
    {
        return factory(User::class)->create();
    }

    /**
     * Create user in DB and act as the new user
     * @return App\User
     */
    public function createAndBeUser()
    {
        $user = $this->createUser();
        $this->actingAs($user, 'api');
        return $user;
    }

    /**
     * Disable AUthorization
     */
    public function disableAuth()
    {
        Gate::before(function () {
            return true;
        });
    }
    
    protected function tearDown()
    {
        Artisan::call('migrate:reset');
        parent::tearDown();
    }
}
