<?php

namespace App\Http\Controllers\Api\v1;

use App\Group;
use App\Http\Controllers\Controller;
use App\Transformers\GroupTransformer;

class GroupController extends Controller
{
    /**
     * GET /groups
     * 
     * List
     *
     * @return Response
     */
    public function index(GroupTransformer $transformer, /* int */ $family_id)
    {
       
        try {
            
            $data = Group::where('family_id', $family_id)->get();
            
            $response = fractal()
                ->collection($data)
                ->transformWith($transformer)
                ->toArray();
            
        } catch (Exception $exc) {
           
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $response;
    }
}
