<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class QuotationGroup extends Model
{
    public $table = 'quotation_groups';
    
    public $fillable = [
            'sale_id',
            'shipment_type_id',
            'fob',
            'volume',
            'weight',
            'import_expenditure',
            'profitability',
            'currency_id',
            'sale_price'];
    
    public function sale()
    {
        return $this->belongsTo('App\ProductSale');
    }
    
    public function products()
    {
        return $this->hasMany('App\ProductSale');
    }
    
    public function shipment_type()
    {
        return $this->belongsTo('App\ShipmentType');
    }
    
    public function attachments()
    {
        return $this->morphMany('App\Attachments', 'entity');
    }
}
