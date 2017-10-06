<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    public $timestamps = false;
    
    function family()
    {
        return $this->belongsTo('App\Family'); 
    }
    
    function products()
    {
        return $this->hasMany('App\Product');
    }
}
