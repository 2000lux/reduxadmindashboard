<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSaleStatusLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_status_logs', function (Blueprint $table) {
                        
            $table->increments('id');
            $table->integer('sale_status_id')->unsigned();
            $table->foreign('sale_status_id')->references('id')
                ->on('sale_statuses')->onDelete('restrict');

            $table->integer('sale_id')->unsigned();
            $table->foreign('sale_id')->references('id')
                ->on('sales')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_status_logs');
    }
}
