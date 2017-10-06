<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    public function products()
    {
        return $this->belongsToMany('App\productQuotation');
    }
    
    public function shipment_type()
    {
        return $this->belongsTo('App\ShipmentType');
    }
}
