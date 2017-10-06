<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Interaction;
use App\Transformers\InteractionTransformer;
use Symfony\Component\HttpFoundation\Request;
use Spatie\Fractal\FractalFacade;

class EnterpriseInteractionController extends Controller
{
    /**
     * GET /enterprises/{id}/interactions
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, InteractionTransformer $transformer, /*int*/ $enterprise_id)
    {
       
        try {

            $data = Interaction::with(['contact' => function($query){
                        $query->select('contacts.id', 'contacts.fullname', 'contacts.position');
                    }])
                    ->whereHas('contact.enterprises', function ($query) use ($enterprise_id) {
                        $query->where('id', $enterprise_id);
                    })
                    ->latest()
                    ->orderBy('id', 'desc')
                    ->get();
                 
            $response = fractal()
                ->collection($data)
                ->transformWith($transformer)
                ->toArray();
            
        } catch (Exception $exc) {
           
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $response;
    }
    
    /**
     * GET /enterprises/{$enterprise_id}/interactions/{$interaction_id}
     */
    public function show(Request $request, InteractionTransformer $transformer, $enterprise_id, $interaction_id)
    {
        try {
            
            $data = Interaction::with([
                    'contact' => function($query) {
                        $query->select('contacts.id', 'fullname', 'position');
                    }, 
                    'contact.enterprises' => function($query) {
                        $query->select('contact_enterprise.enterprise_id');
                    }
                    ])
                    ->whereHas('contact.enterprises', function ($query) use ($enterprise_id) {
                        $query->where('id', $enterprise_id);
                    })

                    ->findOrFail($interaction_id);

            $response = FractalFacade::item($data, $transformer)->toArray();
            
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }
        
        return response()->json($response);
    }       
}
