<?php
namespace App\Transformers;

use App\Task;
use League\Fractal\TransformerAbstract;

class TaskTransformer extends TransformerAbstract
{

    /**
     * Transforms the Model object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param Model $model
     * @return array
     */
    public function transform(Task $model)
    {
        // retrieve only one enterprise, one sector
        $enterprise = $model->enterprise ? $model->enterprise[0] : [];
        $sector = $model->sector ? $model->sector[0] : [];
        $contact = (gettype($model->contact) === 'object') ? $model->contact->toArray() : [];
        
        $date_format = config('app.date_format');
        
        // actually retrieved only in show, not index method
        $comments = $model->comments ?: [];
        
        return [
            'id' => (int) $model->id,
            'description' => html_entity_decode($model->description),
            'viewed' => (boolean) $model->viewed,
            'author' => $model->author,
            'receiver' => $model->receiver,
            'priority' => $model->priority,
            'status' => $model->status,
            'enterprise' => $model->enterprise,
            'sector' => $model->sector,
            'contact' => $contact,
            'comments' => $comments,
            'created_at' => $model->created_at->format($date_format),
            'updated_at' => $model->updated_at->format($date_format),
        ];
    }
}
