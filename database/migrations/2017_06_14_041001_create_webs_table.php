<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWebsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('webs', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->enum('type', ['invoice', 'bidding']);
            $table->string('link', 120);
            $table->string('user', 30);
            $table->string('password', 30);
            $table->integer('enterprise_id')->unsigned();
            $table->timestamps();
            
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
        Schema::dropIfExists('webs');
    }
}
