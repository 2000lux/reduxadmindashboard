<?php

namespace App\Http\Controllers\Api\v1;

use App\Country;
use App\Province;
use App\Http\Controllers\Controller;
use App\Transformers\CountryTransformer;
use App\Transformers\ProvinceTransformer;

class CountryController extends Controller
{
    /**
     * GET /countries
     * 
     * List
     *
     * @return Response
     */
    public function index(CountryTransformer $transformer)
    {
       
        try {

            $data = Country::all();
            
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
     * GET /countries/country_id/provinces
     * 
     * List
     *
     * @return Response
     */
    public function provinces(ProvinceTransformer $transformer, /* int */ $country_id)
    {
       
        try {

            $data = Province::where('country_id', $country_id)->get();
            
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
