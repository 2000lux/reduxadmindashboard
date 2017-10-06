<?php
namespace App\Transformers;

use App\Product;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\TransformerAbstract;

class ProductTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Product $model)
    {
        return [
            'id' => $model->id,
            'type' => $model->type,
            'code' => $model->code,
            'name' => $model->name,
            'provider' => $model->provider,
            'family' => $model->family,
            'group' => $model->group,
            'price' => $model->price,
            'currency' => $model->currency,
        ];
    }
}
