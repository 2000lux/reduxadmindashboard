<?php
namespace App\Transformers;

use App\Contact;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\TransformerAbstract;

class ContactTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Contact $model)
    {
        return [
            'id' => $model->id,
            'fullname' => $model->fullname,
            'position' => $model->position,
            'phones' => $model->phones,
            'cellphone' => $model->cellphone,
            'emails' => $model->emails,
            'sector' => $model->sectors[0],
            'enterprise' => $model->enterprises[0]
        ];
    }
}
