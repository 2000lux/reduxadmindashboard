<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSectorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sectors', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->integer('enterprise_id')->unsigned();
            $table->string('name', 50);
            $table->softDeletes();
            
            $table->unique(['enterprise_id', 'name']);
            
            // Constraints
            $table->foreign('enterprise_id')
                ->references('id')->on('enterprises')
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
        Schema::dropIfExists('sectors');
    }
}
