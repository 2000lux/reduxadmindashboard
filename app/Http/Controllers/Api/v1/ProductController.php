<?php

namespace App\Http\Controllers\Api\v1;

use App\Product;
use App\Http\Controllers\Controller;
use App\Transformers\ProductTransformer;
use Spatie\Fractal\FractalFacade;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /products
     * 
     * List
     *
     * @return Response
     */
    public function index(ProductTransformer $transformer)
    {
       
        try {

            $data = Product::with(['family', 'group', 'currency', 'provider'])
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
     * GET /products/{$id}
     * 
     * Retrieves requested item
     * 
     * @param ProductTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(ProductTransformer $transformer, /*int*/ $id)
    {

        try {

            $modal = Product::findOrFail($id);

            // decouple DB columns from API response fields
            $response = FractalFacade::item($modal, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }

    /**
     * POST /products
     */
    public function store(Request $request)
    {
        
        $this->validate($request, [
            'type' => 'required',
            'code' => 'required|unique:products|max:80',
            'name' => 'required|max:130',
            'price' => 'sometimes|between:0,999999.99',
            'provider' => 'required|integer',
            'family' => 'required|integer',
            'group' => 'required|integer',
            'currency' => 'sometimes|integer'
        ]);
        
        $model = new Product;
        
        $model->type = strip_tags($request->input('type'));
        $model->code = strip_tags($request->input('code'));
        $model->name = strip_tags($request->input('name'));
        $model->price = strip_tags($request->input('price'));
        $model->provider_id = $request->input('provider');
        $model->family_id = $request->input('family');
        $model->group_id = $request->input('group');
        $model->currency_id = $request->input('currency');
        $model->save();
        
        return response()->json([
            'product_id' => $model->id,
            'created_at' => $model->created_at
        ], 201);
    }
    
    /**
     * PUT|PATCH /products/{$id}
     */
    public function update(Request $request, /*int*/ $id)
    {
        try {   
            
            if(count($request->all()) === 0) {
                abort(400, 'At least one field must contain data');
            }
            
            $this->validate($request, [
                'type' => 'sometimes|required',
                'code' => 'sometimes|required|max:80|unique:products,code,'.$id,
                'name' => 'sometimes|required|max:130',
                'price' => 'sometimes|required|between:0,999999.99',
                'provider' => 'sometimes|required|integer',
                'family' => 'sometimes|required|integer',
                'group' => 'sometimes|required|integer',
                'currency' => 'sometimes|integer'
            ]);
            
            // retrieve record
            $model = Product::findOrFail($id);
            
            // sanitize 
            $input['type'] = filter_var($request->input('type'), FILTER_SANITIZE_STRING);
            $input['code'] = filter_var($request->input('code'), FILTER_SANITIZE_STRING);
            $input['name'] = filter_var($request->input('name'), FILTER_SANITIZE_STRING);
            $input['price'] = filter_var($request->input('price'), FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $input['provider_id'] = filter_var($request->input('provider'), FILTER_SANITIZE_NUMBER_INT);
            $input['family_id'] = filter_var($request->input('family'), FILTER_SANITIZE_NUMBER_INT);
            $input['group_id'] = filter_var($request->input('group'), FILTER_SANITIZE_NUMBER_INT);
            $input['currency_id'] = filter_var($request->input('currency'), FILTER_SANITIZE_NUMBER_INT);
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
     * DELETE /products/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Product::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
