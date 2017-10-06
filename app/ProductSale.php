<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    public $table = 'product_sale';
    
    public $timestamps = false;
    
    public function quotationGroup()
    {
        return $this->belongsTo('App\QuotationGroup');
    }  
}
