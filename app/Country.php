<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'countries';
    
    public $timestamps = false;
    
    public function enterprises() 
    {
        return $this->hasMany('App\Enterprise');
    }
    
    public function providers()
    {
        return $this->hasMany('App\Provider');
    }
    
    public function provinces()
    {
        return $this->hasMany('App\Province');
    }
}
