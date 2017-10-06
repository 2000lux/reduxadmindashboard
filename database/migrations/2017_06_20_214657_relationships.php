<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Relationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
           
        Schema::create('contact_sector', function (Blueprint $table) {
       
            $table->integer('contact_id')->unsigned()->nullable()->index();
            $table->foreign('contact_id')->references('id')
                ->on('contacts')->onDelete('cascade');

            $table->integer('sector_id')->unsigned()->nullable()->index();
            $table->foreign('sector_id')->references('id')
                ->on('sectors')->onDelete('restrict');
            
            $table->primary(['contact_id', 'sector_id']);
        });
        
        Schema::create('contact_provider', function (Blueprint $table) {
       
            $table->integer('contact_id')->unsigned()->nullable()->index();
            $table->foreign('contact_id')->references('id')
                ->on('contacts')->onDelete('cascade');

            $table->integer('provider_id')->unsigned()->nullable()->index();
            $table->foreign('provider_id')->references('id')
                ->on('providers')->onDelete('restrict');
            
            $table->integer('state_id')->unsigned()->default(1); 
            
            $table->primary(['contact_id', 'provider_id']);
            
            // Constraints
            $table->foreign('state_id')
                ->references('id')->on('contact_states')
                ->onDelete('restrict'); 
        });
        
        Schema::create('contact_enterprise', function (Blueprint $table) {
       
            $table->integer('contact_id')->unsigned()->nullable()->index();
            $table->foreign('contact_id')->references('id')
                ->on('contacts')->onDelete('cascade');

            $table->integer('enterprise_id')->unsigned()->nullable()->index();
            $table->foreign('enterprise_id')->references('id')
                ->on('enterprises')->onDelete('restrict');
            
            $table->integer('state_id')->unsigned()->default(1);
            
            $table->primary(['contact_id', 'enterprise_id']);
                        
            // Constraints
            $table->foreign('state_id')
                ->references('id')->on('contact_states')
                ->onDelete('restrict');            
        });                
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('enterprise_sector');
        Schema::dropIfExists('contact_sector');
        Schema::dropIfExists('contact_provider');
        Schema::dropIfExists('contact_enterprise');
        Schema::dropIfExists('product_sale');
    }
}
