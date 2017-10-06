<?php

namespace App\Http\Controllers\Api\v1;

use App\Interaction;
use App\Http\Controllers\Controller;
use App\Transformers\InteractionTransformer;
use Symfony\Component\HttpFoundation\Request;

class ContactInteractionController extends Controller
{
    /**
     * GET /contact/{id}/interactions
     * 
     * List
     *
     * @return Response
     */
    public function index(InteractionTransformer $transformer, $contact_id)
    {
       
        try {

            $data = Interaction::with(['contact' => function($query){
                        $query->select('contacts.id', 'contacts.fullname', 'contacts.position');
                    }])
                    ->whereHas('contact', function ($query) use ($contact_id) {
                        $query->where('id', $contact_id);
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
     * GET /contacts/{$contact_id}/interactions/{$interaction_id}
     */
    /*public function show(Request $request, $contact_id, $interaction_id)
    {
        $data = Interaction::with([
                'contact' => function($query) {
                    $query->select('contacts.id', 'fullname', 'position');
                }])               
                ->whereHas('contact', function ($query) use ($contact_id) {
                    $query->where('id', $contact_id);
                })
                ->findOrFail($interaction_id);
        
        return response()->json($data);
    }*/    
    
    /**
     * POST /contacts/{$contact_id}/interactions
     */
    public function store(Request $request, /*int*/ $contact_id)
    {       
        try {
            
            $this->validate($request, [
                'description' => 'required',
                'date' => 'required|date'
            ]);

            $date = new \DateTime( $request->input('date') );
            
            $model = new Interaction();
            $model->contact_id = intval($contact_id);
            $model->description = filter_var($request->input('description'), FILTER_SANITIZE_STRING);
            $model->created_at = $date->format('Y-m-d');
            $model->save();

             return response()->json([
                'interaction_id' => $model->id,
                'created_at' => $model->created_at
            ], 201);
        } catch (Exception $ex) {
            return response()->json(['error' => 'Error storing record.'], 500);
        }
    }
    
    /**
     * PUT|PATCH /contacts/{$contact_id}/interactions/{$interaction_id}
     */
    public function update(Request $request, /*int*/ $contact_id, $interaction_id)
    {
        try {  
            
            $this->validate($request, [
                'description' => 'sometimes|required',
                'date' => 'sometimes|required|date'
            ]);
           
            $date = new \DateTime( $request->input('date') );

            $model = Interaction::where('contact_id', $contact_id)->findOrFail($interaction_id);          
            $model->contact_id = $contact_id;
            $model->created_at = $date->format('Y-m-d');
            $model->description = filter_var($request->input('description'), FILTER_SANITIZE_STRING);
            $model->save();
              
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * DELETE /contacts/{$contact_id}/interactions/{$interaction_id}
     * 
     * @return json
     */
    public function destroy(/*int*/ $contact_id, /*int*/ $interaction_id)
    {
      
        try {
            $model = Interaction::findOrFail($interaction_id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
