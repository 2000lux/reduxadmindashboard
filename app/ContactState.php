<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactState extends Model
{
    public $timestamps = false;
     
    public function enterprises()
    {
        return $this->hasMany('App\Enterprise');
    }
    
    public function providers()
    {
        return $this->hasMany('App\Provider');
    }
}
