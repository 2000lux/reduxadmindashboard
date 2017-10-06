<?php
namespace Tests\App\Transformers;

use Tests\ApiTestCase;
use App\Transformers\UserTransformer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use League\Fractal\TransformerAbstract;

class UserTransformerTest extends ApiTestCase
{

    use DatabaseMigrations;

    /** @test **/
    public function user_transformer_can_be_instantiated()
    {
        $transformer = new UserTransformer;
        $this->assertInstanceOf(TransformerAbstract::class, $transformer);
    }

    /** @test **/
    public function it_transforms_a_user()
    {
        // create a user instance
        $user = factory(User::class)->create();

        // transform user data
        $transformer = new UserTransformer;
        $renewed_user = $transformer->transform($user);

        // check some fields
        $this->assertArrayHasKey('id', $renewed_user);
        $this->assertArrayHasKey('email', $renewed_user);
        $this->assertArrayHasKey('image', $renewed_user);
        $this->assertArrayHasKey('updated_at', $renewed_user);
    }
}
