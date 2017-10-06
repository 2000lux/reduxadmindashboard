<?php

use App\Sale;
use App\SaleStatuses;
use App\SaleGroup;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class SaleSeeder extends Seeder
{
    public function run()
    {
        
        DB::table('product_sale')->delete();
        DB::table('sales')->delete();
        DB::table('sale_statuses')->delete();
        DB::table('sale_status_logs')->delete();
        
        try {
            
            $faker = Faker::create();
         
            // create sales statuses
            $this->createSaleStatuses();
            
            // create transport type
            $this->createShipmentTypes();
            
            // create some sales
            $sales = factory(Sale::class, 21)->create();
            $sales->each(function($sale) use ($faker) {
                
                $products = \App\Product::orderBy(DB::raw('RAND()'))->take(rand(1, 5))->get();

                $products->each(function($product) use ($faker, $sale) {

                    $sale->products()->attach($product, [
                        'quantity'=> rand(1, 7),
                        'currency_id'=> App\Currency::all()->random()->id,                        
                        'fob_price'=> $faker->randomFloat(2, 200, 9000)
                    ]);
                    
                    // Quotation group
                    $quotation_group = \App\QuotationGroup::orderBy(DB::raw('RAND()'))->take(1)->first();
                 
                    if(!$quotation_group || rand(0, 10) > 7) {
                        // create a new quotation group
                        $quotation_group = factory(App\QuotationGroup::class)->create(['sale_id' => $sale->id]);
                    }
             
                    $product_sale = \App\ProductSale::where("product_id", $product->id)->firstOrFail();
                    $product_sale->quotation_group_id = $quotation_group->id;
                    $product_sale->save();                    
                });                             
            });

        } catch (\Illuminate\Database\QueryException $ex) {
            $error_code = $ex->errorInfo[1];
            if($error_code == 1062){
                print ('Skipping duplicated entry');
            }
            print ("* " . $ex->getMessage());
        }
    }
    
    private function createSaleStatuses() {
        
        $states = [
            1=>'Solicitud de Cotización', 
            2=>'Envío de pedido de precio a Proveedor', 
            3=>'A cotizar', 
            4=>'Cotizado',
            5=>'Envío de cotización',
            6=>'Recepción de OC'
        ];
        
        foreach ($states as $key => $state) {
        
            SaleStatuses::create(array(
                'code' => $key,
                'name' => $state
            ));
        }  
    }    
    
    private function createShipmentTypes() {
        
        $type = [
            'avion' => 'Avión', 
            'EMS' => 'EMS', 
            'FOB' => 'FOB', 
            'maritimo-consolidado' => 'Marítimo Consolidado', 
            'maritimo-en-contenedor' => 'Marítimo en Contenedor', 
            'terrestre' => 'Terrestre'];
        
        foreach ($type as $key => $state) {
        
            \App\ShipmentType::create(array(
                'keyname' => $key,
                'name' => $state
            ));
        }  
    }   
}
