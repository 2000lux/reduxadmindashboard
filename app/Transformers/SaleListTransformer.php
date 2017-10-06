<?php
namespace App\Transformers;

use App\Sale;
use League\Fractal\TransformerAbstract;

class SaleListTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Sale $model)
    {
        
        $date_format = config('app.date_format');
        
        return [
            'id'=> $model->id,
            'date'=> $model->created_at->format($date_format),
            'contact_mean'=> $model->contact_mean,
            'enterprise'=> $model->enterprise,
            'contact'=> $model->contact,
            'observations'=> $model->observations,
            'status'=> $model->status
        ];
    }
}
