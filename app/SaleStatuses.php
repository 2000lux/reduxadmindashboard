<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleStatuses extends Model
{
    public $timestamps = false;
    
    protected $fillable = ['name'];
    
    public function sales()
    {
        return $this->hasMany('App\Sale');
    }
    
    public function logs()
    {
        return $this->hasMany('App\SaleStatusLog');
    }
}
