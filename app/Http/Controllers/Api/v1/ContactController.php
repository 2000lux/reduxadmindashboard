<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Contact;

class ContactController extends Controller
{
        
    /**
     * GET /contact/states
     */
    public function states() 
    {
        try {
            
            $states = \App\ContactState::all();
        } catch (Exception $exc) {
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $states;
    }
    
    /**
     * DELETE /contacts/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Contact::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
