<?php
namespace App\Transformers;

use App\Enterprise;
use League\Fractal\TransformerAbstract;

class EnterpriseTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Enterprise $model)
    {
        
        $webs = ['invoice' => null, 'bidding' => null];
        if($model->webs) {
            foreach($model->webs as $web) {
                $webs[$web->type] = $web;
            }
        }
        
        return [
            'id'=> $model->id,
            'legal_name'=> $model->legal_name,
            'cuit'=> $model->cuit,
            'country'=> $model->country,
            'province'=> $model->province,
            'invoice_web'=> $webs['invoice'],
            'bidding_web'=> $webs['bidding'], 
            'town'=> $model->town,
            'address'=> $model->address,
            'zipcode'=> $model->zipcode,
            'phone'=> $model->phone,      
            'observations'=> $model->observations,
            'client_type'=> $model->client_type
        ];
    }
}
