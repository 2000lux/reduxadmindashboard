<?php
namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\ProductSale;
use App\QuotationGroup;
use App\QuotationShipmentCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use function response;
        
/**
 * Quotation Groups controller
 */
class QuotationController extends Controller
{
    /**
     * POST /sales/quotation/calculate-import-expenditure
     * 
     * @param Request $request
     * @return json
     */
    public function calculateImportExpenditure(Request $request)
    {
        try {
            
            $this->validate($request, [
                'shipment_type' => 'required',
                'fob_price' => 'required',
                'volume' => 'sometimes|required|numeric',
                'weight' => 'sometimes|required|numeric',
                'containers_quantity' => 'sometimes|required|numeric',
                'size' => 'sometimes|required',
                'client_transport' => 'sometimes|required'
            ]);

            // get variables
            $shipment_type = filter_var($request->input('shipment_type'), FILTER_SANITIZE_STRING);        
            $input['fob_price'] = filter_var($request->input('fob_price'), FILTER_SANITIZE_NUMBER_FLOAT);
            $input['volume'] = filter_var($request->input('volume'), FILTER_SANITIZE_NUMBER_FLOAT);
            $input['weight'] = filter_var($request->input('weight'), FILTER_SANITIZE_NUMBER_FLOAT);
            $input['containers_quantity'] = filter_var($request->input('containers_quantity'), FILTER_SANITIZE_NUMBER_INT);
            $input['size'] = filter_var($request->input('size'), FILTER_SANITIZE_STRING);
            $input['client_transport'] = filter_var($request->input('client_transport'), FILTER_SANITIZE_NUMBER_FLOAT);
        
            // remove empty fields
            $request->replace( array_filter($input, function($i){ return !empty($i); } ) );
           
            // process the non empty ones
            $fields = $request->all();
            
            // read template
            $model = new QuotationShipmentCalculator($shipment_type);
            $model->loadTemplate();
            $model->mapFields($fields);

            // write xlsx
            $file_name = Carbon::now() . "_" . $shipment_type; 
            $model->save($file_name);
            
            // read result
            $calcModel = new QuotationShipmentCalculator($shipment_type);
            $calcModel->loadFile($file_name);
            $result = $calcModel->readResult();
            
            // xlsx URl
            $resource_url = $model->getLink($file_name);
                
        } catch (Exception $ex) {
            return response()->json([ 'message' => 'There was an error calculating the cost' ], 500);
        }
        
        return response()->json([
            'filename' => $file_name.".xlsx",
            'download_link' => $model->getLink($file_name),
            'import_expenditure' => number_format($result, 2, '.', '')
        ]);
    }
    
    /**
     * POST /sales/quotation/create-group
     * 
     * @param Request $request
     * @return json
     */
    public function createGroup(Request $request)
    {
        $this->validate($request, [
            'sale_id' => 'required|integer',
            'shipment_type_id' => 'required|integer',
            'fob' => 'sometimes|required|numeric',
            'volume' => 'sometimes|required|numeric',
            'weight' => 'sometimes|required|numeric',
            'import_expenditure' => 'required|numeric',
            'profitability' => 'required|numeric',
            'currency_id' => 'required|integer',
            'sale_price' => 'required|numeric'
        ]);
        
        $model = new QuotationGroup();
        
        $data = [];
        $data['sale_id'] = intval($request->input('sale_id'));
        $data['shipment_type_id'] = intval($request->input('shipment_type_id'));
        $data['fob'] = floatval($request->input('fob_price'));
        $data['volume'] = floatval($request->input('volume'));
        $data['weight'] = floatval($request->input('weight'));
        $data['import_expenditure'] = floatval($request->input('import_expenditure'));
        $data['profitability'] = floatval($request->input('profitability'));
        $data['currency_id'] = intval($request->input('currency_id'));
        $data['sale_price'] = floatval($request->input('sale_price'));
        
        $data = array_filter($data, function($i){ return !empty($i); } );
        $model->fill($data);
        $model->save();
        
        // update related products
        $products = array_map(function($p) {
            return $p['id'];
        }, $request->input('products'));
        
        ProductSale::where('sale_id', $data['sale_id'])
            ->whereIn('product_id', $products)
            ->update(['quotation_group_id'=>$model->id]);    
       
        return response()->json([
            'id' => $model->id,
            'created_at' => $model->created_at
        ], 201);
    }
    
    public function getModels()
    {
     
        $files = Storage::files('public/quotation/models');
        $models = [];
        foreach ($files as $file)
        {
            $filename = basename($file);
            $models[] = [
                'name'=> basename($filename),
                'link'=> "/api/v1/sales/quotation/download-model/{$filename}"
            ];
        }
        
        return $models;
    }
    
    public function downloadModel($filename) 
    {
        // Check if file exists in app/storage/file folder
        $file_path = storage_path().'/app/public/quotation/models/'. $filename;
     
        $new_filename = 'coti-[n]-[client].doc';
        // Send Download
        return response()->download($file_path, $new_filename);
    }
    
    /**
     * DELETE /sales/quotation/{$id}
     * 
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            ProductSale::where('quotation_group_id', $id)
                ->update(['quotation_group_id'=>null]);    
                   
            $model = QuotationGroup::findOrFail($id);
            $model->delete();
            
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
