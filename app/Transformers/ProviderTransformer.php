<?php
namespace App\Transformers;

use App\Country;
use App\Provider;
use App\Province;
use App\User;
use League\Fractal\TransformerAbstract;

class ProviderTransformer extends TransformerAbstract
{

    /**
     * Transforms the User object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Provider $model)
    {
        return [
            'id'=> $model->id,
            'legal_name'=> $model->legal_name,
            'cuit'=> $model->cuit,
            'country'=> $model->country,
            'province'=> $model->province,
            'town'=> $model->town,
            'address'=> $model->address,
            'zipcode'=> $model->zipcode,
            'phone'=> $model->phone,      
            'email'=> $model->email,      
            'web'=> $model->web,      
            'observations'=> $model->observations,
        ];
    }
}
 