<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    public $timestamps = false;
    
    public function country()
    {
        return $this->belongsTo('App\Country');
    }
    
    public function enterprises() 
    {
        return $this->hasMany('App\Enterprise');
    }
    
    public function providers()
    {
        return $this->hasMany('App\Provider');
    }
}
