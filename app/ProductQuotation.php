<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductQuotation extends Model
{
    public $table = 'product_quotation';
    
    public function shipments() {
        return $this->belongsToMany('App\Shipment');
    }
}
