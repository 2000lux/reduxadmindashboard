<?php

namespace App\Http\Controllers\Api\v1;

use App\Enterprise;
use App\Http\Controllers\Controller;
use App\Transformers\EnterpriseTransformer;
use App\Web;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Spatie\Fractal\FractalFacade;
use function fractal;
use function response;

class EnterpriseController extends Controller
{
    /**
     * GET /enterprises
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, EnterpriseTransformer $transformer)
    {
       
        try {
            
            $country_id = (int) $request->input('country_id');
            $client_type = $request->input('client_type');
             
            $data = Enterprise::with(['country', 'province', 'webs'])
                ->when($country_id, function ($query) use ($country_id) {
                    return $query->where('country_id', $country_id);
                })
                ->when($client_type, function ($query) use ($client_type) {
                    return $query->where('client_type', $client_type);
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
     * GET /enterprises/{$id}
     * 
     * Retrieves requested record
     * 
     * @param EnterpriseTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(EnterpriseTransformer $transformer, /*int*/ $id)
    {

        try {

            $enterprise = Enterprise::findOrFail($id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($enterprise, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }
    
    /**
     * POST /enterprises
     */
    public function store(Request $request)
    {
        
        $this->validate($request, [
            'legal_name' => 'required|unique:enterprises|max:70',
            'cuit' => 'required|unique:enterprises|max:13',
            'country' => 'required|integer',
            'province' => 'required|integer',
            'town' => 'required|max:40',
            'address' => 'required|max:120',
            'zipcode' => 'sometimes|max:12',
            'phone' => 'required',
            'bidding_web.link' => 'sometimes|url|max:120',
            'bidding_web.user' => 'sometimes|max:30',
            'bidding_web.password' => 'sometimes|max:30',
            'invoice_web.link' => 'sometimes|url|max:120',
            'invoice_web.user' => 'sometimes|max:30',
            'invoice_web.password' => 'sometimes|max:30',
            'observations' => 'sometimes|present',
            'client_type' => 'required'
        ]);
        
        $model = new Enterprise;
        
        $model->legal_name = strip_tags($request->input('legal_name'));
        $model->cuit = strip_tags($request->input('cuit'));
        $model->country_id = intval($request->input('country'));
        $model->province_id = intval($request->input('province'));
        $model->town = strip_tags($request->input('town'));
        $model->address = strip_tags($request->input('address'));
        $model->zipcode = strip_tags($request->input('zipcode'));
        $model->phone = strip_tags($request->input('phone'));
        $model->observations = $request->input('observations');
        $model->client_type = strip_tags($request->input('client_type'));
        $model->save();
        
        $bidding_web = new Web();
        $bidding_web->type = 'bidding';
        $bidding_web->link = strip_tags($request->input('bidding_web.link'));
        $bidding_web->user = strip_tags($request->input('bidding_web.user'));
        $bidding_web->password = strip_tags($request->input('bidding_web.password'));
        $bidding_web->enterprise_id = $model->id;
        $bidding_web->save();
        
        $invoice_web = new Web();
        $invoice_web->type = 'invoice';
        $invoice_web->link = strip_tags($request->input('invoice_web.link'));
        $invoice_web->user = strip_tags($request->input('invoice_web.user'));
        $invoice_web->password = strip_tags($request->input('invoice_web.password'));
        $invoice_web->enterprise_id = $model->id;
        $invoice_web->save();
        
        
        return response()->json([
            'enterprise_id' => $model->id,
            'created_at' => $model->created_at
        ], 201);
    }
    
    /**
     * PUT|PATCH /enterprises/{$id}
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
                'cuit' => 'sometimes|required|max:13|unique:enterprises,cuit,'.$id,
                'country' => 'sometimes|integer',
                'province' => 'sometimes|integer',
                'town' => 'sometimes|required|max:40',
                'address' => 'sometimes|required|max:120',
                'zipcode' => 'sometimes|max:12',
                'phone' => 'sometimes|required',
                'bidding_web.link' => 'sometimes|url|max:120',
                'bidding_web.user' => 'sometimes|max:30',
                'bidding_web.password' => 'sometimes|max:30',
                'invoice_web.link' => 'sometimes|url|max:120',
                'invoice_web.user' => 'sometimes|max:30',
                'invoice_web.password' => 'sometimes|max:30',
                'observations' => 'sometimes|present',
                'client_type' => 'sometimes|required'
            ]);
           
            // webs
            $webs = [
                'bidding' => $request->input('bidding_web'),
                'invoice' => $request->input('invoice_web')
                ];
            
            // retrieve record
            $model = Enterprise::findOrFail($id);
           
            // sanitize 
            $input['legal_name'] = filter_var($request->input('legal_name'), FILTER_SANITIZE_STRING);
            $input['cuit'] = filter_var($request->input('cuit'), FILTER_SANITIZE_STRING);
            $input['country_id'] = filter_var($request->input('country'), FILTER_SANITIZE_NUMBER_INT);
            $input['province_id'] = filter_var($request->input('province'), FILTER_SANITIZE_NUMBER_INT);
            $input['town'] = filter_var($request->input('town'), FILTER_SANITIZE_STRING);
            $input['address'] = filter_var($request->input('address'), FILTER_SANITIZE_STRING);
            $input['zipcode'] = filter_var($request->input('zipcode'), FILTER_SANITIZE_STRING);
            $input['phone'] = filter_var($request->input('phone'), FILTER_SANITIZE_STRING);
            $input['observations'] = filter_var($request->input('observations'), FILTER_SANITIZE_STRING);
            $input['client_type'] = filter_var($request->input('client_type'), FILTER_SANITIZE_STRING);
            $request->replace( array_filter($input, function($i){ return !empty($i); } ) );
           
            // fill method assures only expected fields will be stored
            $model->fill($request->all());
            $model->save();
           
            $bidding_web = Web::firstOrNew( ['type' => 'bidding', 'enterprise_id' => $model->id] );
            $bidding_web->link = strip_tags($webs['bidding']['link']);
            $bidding_web->user = strip_tags($webs['bidding']['user']);
            $bidding_web->password = strip_tags($webs['bidding']['password']);
            $bidding_web->save();

            $invoice_web = Web::firstOrNew( ['type' => 'invoice', 'enterprise_id' => $model->id] );
            $invoice_web->link = strip_tags($webs['invoice']['link']);
            $invoice_web->user = strip_tags($webs['invoice']['user']);
            $invoice_web->password = strip_tags($webs['invoice']['password']);
            $invoice_web->save();
                
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * DELETE /enterprises/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Enterprise::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
