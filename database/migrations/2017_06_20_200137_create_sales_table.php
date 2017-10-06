<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');  
            $table->enum('contact_mean', ['email', 'web', 'telefono', 'otro']);
            $table->integer('sale_status_id')->unsigned();
            $table->integer('enterprise_id')->unsigned();
            $table->integer('contact_id')->unsigned();
            $table->text('observations')->nullable();            
            $table->string('quotation_number')->nullable(); // ID + custom string
            $table->integer('currency_id')->unsigned();
            $table->decimal('total_price', 8, 2);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('enterprise_id')
                ->references('id')->on('enterprises')
                ->onDelete('restrict');   
            $table->foreign('contact_id')
                ->references('id')->on('contacts')
                ->onDelete('restrict'); 
            $table->foreign('sale_status_id')
                ->references('id')->on('sale_statuses')
                ->onDelete('restrict');  
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
                ->onDelete('restrict');   
        });        
        
        Schema::create('shipment_types', function (Blueprint $table) {
            
            $table->increments('id');  
            $table->enum('keyname', ['avion', 'EMS', 'FOB', 'maritimo-consolidado', 'maritimo-en-contenedor', 'terrestre']);
            $table->enum('name', ['Avión', 'EMS', 'FOB', 'Marítimo Consolidado', 'Marítimo en Contenedor', 'Terrestre']);
        });
        
        Schema::create('quotation_groups', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');  
            $table->integer('shipment_type_id')->unsigned();
            $table->integer('sale_id')->unsigned();
            $table->decimal('fob', 8, 2);
            $table->decimal('volume', 8, 2);
            $table->decimal('weight', 8, 2);
            $table->decimal('import_expenditure', 8, 2);
            $table->decimal('profitability', 4, 2)->nullable();
            $table->integer('currency_id')->unsigned();
            $table->decimal('sale_price', 8, 2);
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('shipment_type_id')
                ->references('id')->on('shipment_types')
                ->onDelete('restrict');  
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
                ->onDelete('restrict');   
            $table->foreign('sale_id')
                ->references('id')->on('sales')
                ->onDelete('cascade');   
        });     
            
        Schema::create('product_sale', function (Blueprint $table) {
            
            $table->increments('id');  
            $table->integer('product_id')->unsigned();
            $table->integer('quotation_group_id')->unsigned()->nullable();
            $table->integer('sale_id')->unsigned();
            $table->integer('quantity')->unsigned();
            $table->integer('currency_id')->unsigned();
            $table->decimal('fob_price', 8, 2);
            
            // Constraints
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->onDelete('cascade');
            $table->foreign('quotation_group_id')
                ->references('id')->on('quotation_groups')
                ->onDelete('cascade');
            $table->foreign('sale_id')
                ->references('id')->on('sales')
                ->onDelete('cascade');  
        });
        
         Schema::create('purchase_orders', function (Blueprint $table) {
            
            $table->increments('id');  
            $table->integer('sale_id')->unsigned();
            $table->string('number'); // ID + custom string
            $table->integer('currency_id')->unsigned();
            $table->integer('contact_id')->unsigned();
            $table->decimal('price', 8, 2);
            $table->integer('exchange_rate')->unsigned();
            $table->timestamps();
            
            $table->foreign('sale_id')
                ->references('id')->on('sales')
                ->onDelete('cascade');
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
                ->onDelete('restrict');   
            $table->foreign('contact_id')
                ->references('id')->on('contacts')
                ->onDelete('restrict'); 
        });
        
        Schema::create('payments', function (Blueprint $table) {
            
            $table->integer('purchase_order_id')->unsigned();
            $table->string('number'); // ID + custom string
            $table->date('date');
            $table->integer('currency_id')->unsigned();
            $table->integer('contact_id')->unsigned();
            $table->decimal('price', 8, 2);
            $table->integer('exchange_rate')->unsigned();
            
            $table->foreign('purchase_order_id')
                ->references('id')->on('purchase_orders')
                ->onDelete('cascade');
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
                ->onDelete('restrict');   
            $table->foreign('contact_id')
                ->references('id')->on('contacts')
                ->onDelete('restrict'); 
        });
        
        Schema::create('attachments', function (Blueprint $table) {
            $table->increments('id');  
            $table->integer('entity_id')->unsigned();
            $table->string('entity_type', 30);
            $table->string('filename', 50);
            $table->integer('days')->unsigned();
            $table->text('description');            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('product_sale');
        Schema::dropIfExists('quotation_groups');
        Schema::dropIfExists('shipment_types');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('sales');
    }
}
