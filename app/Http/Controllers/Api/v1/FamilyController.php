<?php

namespace App\Http\Controllers\Api\v1;

use App\Family;
use App\Http\Controllers\Controller;
use App\Transformers\FamilyTransformer;

class FamilyController extends Controller
{
    /**
     * GET /families
     * 
     * List
     *
     * @return Response
     */
    public function index(FamilyTransformer $transformer)
    {
       
        try {

            $data = Family::all();
            
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
