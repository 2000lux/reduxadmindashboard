<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('author_id')->unsigned();
            $table->integer('receiver_id')->unsigned();
            $table->integer('enterprise_id')->unsigned()->nullable();
            $table->integer('sector_id')->unsigned()->nullable();
            $table->integer('contact_id')->unsigned()->nullable();
            $table->enum('priority', ['normal', 'urgente'])->default('normal');
            $table->enum('status', ['pendiente', 'realizada', 'finalizada'])->default('pendiente');
            $table->text('description');
            $table->boolean('viewed')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('author_id')
                ->references('id')->on('users'); // onDelete NO ACTION
            $table->foreign('receiver_id')
                ->references('id')->on('users'); // onDelete NO ACTION
            $table->foreign('contact_id')
                ->references('id')->on('contacts'); // onDelete NO ACTION
        });
        
        Schema::create('comments', function(Blueprint $table) {
            $table->increments('id');
            $table->text('content');
            $table->integer('user_id')->unsigned();
            $table->integer('commentable_id')->unsigned();
            $table->string('commentable_type', 30);
            $table->timestamps();     
            
            $table->foreign('user_id')
                ->references('id')->on('users'); // onDelete NO ACTION
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('comments');
    }
}
