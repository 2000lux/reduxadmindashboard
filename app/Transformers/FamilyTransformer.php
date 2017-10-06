<?php
namespace App\Transformers;

use App\Family;
use League\Fractal\TransformerAbstract;

class FamilyTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Family $model)
    {

        return [
            'id' => (int) $model->id,
            'name' => $model->name
        ];
    }
}
