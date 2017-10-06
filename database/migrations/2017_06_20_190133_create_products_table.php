<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->enum('type', ['producto', 'repuesto']);
            $table->string('code', 80)->unique();
            $table->string('name', 130);
            $table->integer('provider_id')->unsigned();
            $table->integer('family_id')->unsigned();
            $table->integer('group_id')->unsigned();
            $table->decimal('price', 8, 2);
            $table->integer('currency_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('provider_id')
                ->references('id')->on('providers')
                ->onDelete('restrict'); 
            $table->foreign('family_id')
                ->references('id')->on('families')
                ->onDelete('restrict'); 
            $table->foreign('group_id')
                ->references('id')->on('groups')
                ->onDelete('restrict'); 
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
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
        Schema::dropIfExists('products');
    }
}
