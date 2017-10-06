<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSalesTransportTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('shipment_types', function (Blueprint $table) {
            $table->increments('id');  
            $table->enum('name', ['Avión', 'EMS', 'FOB', 'Marítimo Consolidado', 'Marítimo en Contenedor', 'Terrestre']);
        });
        
        Schema::create('shipments', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');  
            $table->integer('shipment_type_id')->unsigned();
            $table->decimal('fob', 8, 2);
            $table->decimal('volume', 8, 2);
            $table->decimal('weight', 8, 2);
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('shipment_type_id')
                ->references('id')->on('shipment_types')
                ->onDelete('restrict');  
        });        
        
        Schema::create('product_quotation_shipment', function (Blueprint $table) {
            
            $table->integer('product_quotation_id')->unsigned();
            $table->integer('shipment_id')->unsigned();
            
            $table->foreign('product_quotation_id')
                ->references('id')->on('product_quotation')
                ->onDelete('cascade');
            $table->foreign('shipment_id')
                ->references('id')->on('shipments')
                ->onDelete('cascade');   
        });        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_quotation_shipment');
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('shipment_types');
    }
}
