<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $fillable = ['type', 'code', 'name', 'price', 'provider_id', 'family_id', 'group_id', 'currency_id'];
     
    protected $hidden = ['deleted_at'];
    
    function currency()
    {
        return $this->belongsTo('App\Currency');
    }
    
    function family()
    {
        return $this->belongsTo('App\Family');
    }
    
    /**
     * A group is just a category
     * @return type
     */
    function group()
    {
        return $this->belongsTo('App\Group');
    }
    
    function provider()
    {
        return $this->belongsTo('App\Provider');
    }
    
    function sales()
    {
        return $this->belongsToMany('App\Sale')->withPivot('quantity');
    }
  
    function quotationGroup() 
    {
        return $this->belongsTo('App\QuotationGroup');
    }
    
    /**
     * Used to merge pivot table data with product data when querying a quotation
     * 
     * @return type
     */
    public function toArray()
    { 
        $attributes = $this->attributesToArray();
        $attributes = array_merge($attributes, $this->relationsToArray());
     
        // Detect if there is a quotation id and return pivot data merged w/ product data
        if (isset($attributes['pivot']['quotation_id'])) { 
            $attributes = array_merge($attributes, $attributes['pivot']);
            unset($attributes['pivot']);
        }
        
        return $attributes;
    }
}
