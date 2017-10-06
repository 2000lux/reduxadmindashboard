<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    
    protected $table = 'currencies';
    
    public $timestamps = false;
    
    public function sales() 
    {
        return $this->hasMany('App\Sale');
    }
    
    public function products() 
    {
        return $this->hasMany('App\Product');
    }
}
