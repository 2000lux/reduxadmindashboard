<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleStatus extends Model
{
    public $timestamps = false;
    
    public function sales()
    {
        return $this->hasMany('App\Sale');
    }
    
    public function logs()
    {
        return $this->hasMany('App\SaleStatusLog');
    }
}
