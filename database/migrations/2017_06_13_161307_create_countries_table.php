<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCountriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('countries', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->string('name');
            $table->string('code');
        });
        
        Schema::create('provinces', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->string('name');
            $table->integer('country_id')->unsigned();
            
            // Constraints
            $table->foreign('country_id')
                ->references('id')->on('countries')
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
        Schema::dropIfExists('provinces');
        
        Schema::dropIfExists('countries');        
    }
}
