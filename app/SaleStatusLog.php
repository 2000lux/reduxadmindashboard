<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleStatusLog extends Model
{
    public function sale()
    {
        return $this->belongsTo('App\Sale');
    }
    
    public function status()
    {
        return $this->belongsTo('App\SaleStatus');
    }
}
