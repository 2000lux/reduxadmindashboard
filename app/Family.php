<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    public $timestamps = false;
    
    function groups()
    {
        $this->hasMany('App\Group');
    }
    
    function products()
    {
        $this->hasMany('App\Product');
    }
}
