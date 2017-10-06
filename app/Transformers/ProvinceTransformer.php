<?php
namespace App\Transformers;

use App\Province;
use League\Fractal\TransformerAbstract;

class ProvinceTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Province $model)
    {

        return [
            'id' => (int) $model->id,
            'name' => $model->name
        ];
    }
}
