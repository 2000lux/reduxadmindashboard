<?php
namespace Tests\App\Transformers;

use Tests\ApiTestCase;
use App\Transformers\EnterpriseTransformer;
use App\Enterprise;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use League\Fractal\TransformerAbstract;

class EnterpriseTransformerTest extends ApiTestCase
{

    use DatabaseMigrations;

    /** @test **/
    public function enterprise_transformer_can_be_instantiated()
    {
        $transformer = new EnterpriseTransformer;
        $this->assertInstanceOf(TransformerAbstract::class, $transformer);
    }

    /** @test **/
    public function it_transforms_an_enterprise()
    {
        // create a user instance
        $model = factory(Enterprise::class)->create();

        // transform user data
        $transformer = new EnterpriseTransformer;
        $transformed = $transformer->transform($model);

        // check some fields
        $this->assertArrayHasKey('id', $transformed);
        $this->assertArrayHasKey('legal_name', $transformed);
        $this->assertArrayHasKey('cuit', $transformed);
        $this->assertArrayHasKey('country', $transformed);
        $this->assertArrayHasKey('phone', $transformed);
        $this->assertArrayHasKey('observations', $transformed);
        $this->assertArrayHasKey('client_type', $transformed);
    }
}
