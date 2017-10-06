<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->string('fullname', 45);
            $table->string('position', 70);
            $table->text('phones')->nullable();
            $table->string('cellphone', 30)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('contact_states', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->string('keyname', 20);
            $table->string('name', 20);   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('contact_states');
    }
}
