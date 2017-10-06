<?php

namespace App\Http\Controllers\Api\v1;

use App\Provider;
use App\Http\Controllers\Controller;
use App\Transformers\ProviderTransformer;
use Illuminate\Http\Request;
use Spatie\Fractal\FractalFacade;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProviderController extends Controller
{
    /**
     * GET /providers
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, ProviderTransformer $transformer)
    {
       
        try {
            
            $country_id = (int) $request->input('country_id');

            $data = Provider::with(['country', 'province'])
                ->when($country_id, function ($query) use ($country_id) {
                    return $query->where('country_id', $country_id);
                })
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
     * GET /providers/{$id}
     * 
     * Retrieves requested item
     * 
     * @param ProviderTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(ProviderTransformer $transformer, /*int*/ $id)
    {

        try {

            $model = Provider::findOrFail($id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($model, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }
    
    /**
     * POST /providers
     */
    public function store(Request $request)
    {
        
        $this->validate($request, [
            'legal_name' => 'required|unique:providers|max:70',
            'cuit' => 'required|unique:providers|max:13',
            'country' => 'required|integer',
            'province' => 'required|integer',
            'town' => 'required|max:40',
            'address' => 'required|max:120',
            'zipcode' => 'sometimes|max:12',
            'email' => 'sometimes|email|max:60',
            'web' => 'sometimes|url|max:255',
            'observations' => 'sometimes|present'
        ]);
        
        $model = new Provider;
        
        $model->legal_name = strip_tags($request->input('legal_name'));
        $model->cuit = strip_tags($request->input('cuit'));
        $model->country_id = intval($request->input('country'));
        $model->province_id = intval($request->input('province'));
        $model->town = strip_tags($request->input('town'));
        $model->address = strip_tags($request->input('address'));
        $model->zipcode = strip_tags($request->input('zipcode'));
        $model->phone = strip_tags($request->input('phone'));
        $model->email = strip_tags($request->input('email'));
        $model->web = strip_tags($request->input('web'));
        $model->observations = $request->input('observations');
        $model->save();
        
        return response()->json([
            'provider_id' => $model->id,
            'created_at' => $model->created_at
        ], 201);
    }
    
    /**
     * PUT|PATCH /providers/{$id}
     */
    public function update(Request $request, /*int*/ $id)
    {
        try {   
            
            if(count($request->all()) === 0) {
                abort(400, 'At least one field must contain data');
            }
            
            $this->validate($request, [
                'id' => 'sometimes|required|integer',
                'legal_name' => 'sometimes|required|max:70',
                'cuit' => 'sometimes|required|max:13|unique:providers,cuit,'.$id,
                'country' => 'sometimes|integer',
                'province' => 'sometimes|integer',
                'town' => 'sometimes|required|max:40',
                'address' => 'sometimes|required|max:120',
                'zipcode' => 'sometimes|max:12',
                'phone' => 'sometimes|required',
                'email' => 'sometimes|email|required|max:60',
                'web' => 'sometimes|required|url|max:255',
                'observations' => 'sometimes|present'
            ]);
            
            // retrieve record
            $model = Provider::findOrFail($id);
           
            // sanitize 
            $input['legal_name'] = filter_var($request->input('legal_name'), FILTER_SANITIZE_STRING);
            $input['cuit'] = filter_var($request->input('cuit'), FILTER_SANITIZE_STRING);
            $input['country_id'] = filter_var($request->input('country'), FILTER_SANITIZE_NUMBER_INT);
            $input['province_id'] = filter_var($request->input('province'), FILTER_SANITIZE_NUMBER_INT);
            $input['town'] = filter_var($request->input('town'), FILTER_SANITIZE_STRING);
            $input['address'] = filter_var($request->input('address'), FILTER_SANITIZE_STRING);
            $input['zipcode'] = filter_var($request->input('zipcode'), FILTER_SANITIZE_STRING);
            $input['phone'] = filter_var($request->input('phone'), FILTER_SANITIZE_STRING);
            $input['email'] = filter_var($request->input('email'), FILTER_SANITIZE_STRING);
            $input['web'] = filter_var($request->input('web'), FILTER_SANITIZE_STRING);
            $input['observations'] = filter_var($request->input('observations'), FILTER_SANITIZE_STRING);
            $request->replace( array_filter($input, function($i){ return !empty($i); } ) );
           
            // fill method assures only expected fields will be stored
            $model->fill($request->all());
            $model->save();
                
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * DELETE /providers/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Provider::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
