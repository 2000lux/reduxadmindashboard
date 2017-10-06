<?php

namespace App\Http\Controllers\Api\v1;

use App\Sale;
use App\Http\Controllers\Controller;
use App\Transformers\SaleTransformer;
use App\Transformers\SaleListTransformer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Spatie\Fractal\FractalFacade;
use function fractal;
use function response;

class SaleController extends Controller
{
    /**
     * GET /sales
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, SaleListTransformer $transformer)
    {
       
        try {
            
            $enterprise_id = (int) $request->input('enterprise_id');
            $status_id = (int) $request->input('status_id');
            $date_from = $request->input('date_from');
            $date_to = $request->input('date_to');
            
            $data = Sale::with([
                'enterprise' => function($query) {
                    $query->select('id', 'legal_name');
                }, 
                'contact' => function($query) {
                    $query->select('id', 'fullname');
                }, 
                'status'
                ])
                ->when($date_from, function($query) use ($date_from) {
                    $query->whereDate('created_at', '>=', $date_from);
                })
                ->when($date_to, function($query) use ($date_to) {
                    $query->whereDate('created_at', '<=', $date_to);
                })
                ->when($enterprise_id, function ($query) use ($enterprise_id) {
                    $query->whereHas('enterprise', function($q) use ($enterprise_id){
                        $q->where('id', $enterprise_id);
                    });
                })
                ->when($status_id, function ($query) use ($status_id) {
                    $query->whereHas('status', function($q) use ($status_id){
                        $q->where('id', $status_id);
                    });
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
     * GET /sales/statuses
     */
    public function statuses() 
    {
        try {
            
            $states = \App\SaleStatuses::all();
        } catch (Exception $exc) {
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $states;
    }
    
    /**
     * GET /sales/contact-means
     */
    public function contactMeans() 
    {
        return [
            ['value' => 'email', 'label' => 'Email'],
            ['value' => 'web', 'label' => 'Web'],
            ['value' => 'telefono', 'label' => 'Telefono'],
            ['value' => 'otro', 'label' => 'Otro']
        ];
    }
    
    /**
     * GET /sales/shipment-types
     */
    public function shipmentTypes() 
    {
        try {
            
            $shipments = \App\ShipmentType::all();
        } catch (Exception $exc) {
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $shipments;
    }
        
    /**
     * GET /sales/{$id}
     * 
     * Retrieves requested record
     * 
     * @param SaleTransformer $transformer 
     * @param integer $id 
     * @return json
     */
    public function show(SaleTransformer $transformer, /*int*/ $id)
    {

        try {

            $sale = Sale::with([
                    'products', 
                    'quotationGroups' => function($query) {
                        return $query->with('attachments');
                    }
                ])
                ->where('id', $id)
                ->firstOrFail();
            
            // decouple DB columns from API response fields
            $response = FractalFacade::item($sale, $transformer)->toArray();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($response);
    }
    
    /**
     * POST /sales
     */
    public function store(Request $request)
    {
        
        $this->validate($request, [
            'date' => 'required|date',
            'contact_mean' => 'required',
            'sale_status_id' => 'required|integer',
            'enterprise_id' => 'required|integer',
            'contact_id' => 'required|integer',
            'currency_id' => 'sometimes|required|integer',
            'total_price' => 'sometimes|required|number',
            'observations' => 'sometimes|present'
        ]);
        
        $model = new Sale;
        
        $date = new \DateTime( $request->input('date') );
        
        $model->created_at = $date;
        $model->contact_mean = strip_tags($request->input('contact_mean'));
        $model->sale_status_id = intval($request->input('sale_status_id'));
        $model->enterprise_id = intval($request->input('enterprise_id'));
        $model->contact_id = intval($request->input('contact_id'));
        $model->currency_id = intval($request->input('currency_id')) || \App\Currency::first()->id;
        $model->total_price = floatval($request->input('total_price')) || 0;
        $model->observations = $request->input('observations');
        $model->save();
        
        return response()->json([
            'sale_id' => $model->id,
            'created_at' => $model->created_at
        ], 201);
    }
    
    /**
     * PUT|PATCH /sales/{$id}
     */
    public function update(Request $request, /*int*/ $id)
    {
        try {   
            
            if(count($request->all()) === 0) {
                abort(400, 'At least one field must contain data');
            }
            
            $this->validate($request, [
                'date' => 'required|date',
                'contact_mean' => 'required',
                'sale_status_id' => 'required|integer',
                'enterprise_id' => 'required|integer',
                'contact_id' => 'required|integer',
                'observations' => 'sometimes|present',
            ]);
           
            // webs
            $webs = [
                'bidding' => $request->input('bidding_web'),
                'invoice' => $request->input('invoice_web')
                ];
            
            // retrieve record
            $model = Sale::findOrFail($id);
           
            // sanitize 
            $date = new \DateTime( $request->input('date') );
        
            // save status log if changed
            $status = intval($request->input('sale_status_id'));
            if($model->sale_status_id !== $status) {
                $statusLog = new \App\SaleStatusLog();
                $statusLog->sale_id = $model->id;
                $statusLog->sale_status_id = $status;
                $statusLog->save();
            }
            
            // save main sale data
            $model->created_at = $date;
            $model->contact_mean = strip_tags($request->input('contact_mean'));
            $model->sale_status_id = $status;
            $model->enterprise_id = intval($request->input('enterprise_id'));
            $model->contact_id = intval($request->input('contact_id'));
            $model->observations = $request->input('observations');
            $model->save();
     
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * DELETE /sales/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Sale::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
