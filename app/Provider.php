<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $fillable = ['legal_name', 'cuit', 'country_id', 'province_id', 'town', 'address', 'zipcode', 'phone', 'email', 'web', 'observations'];

    protected $hidden = ['deleted_at', 'pivot'];

    
    public function country()
    {
        return $this->belongsTo('App\Country');
    }
    
    public function province()
    {
        return $this->belongsTo('App\Province');
    }
    
    public function contacts()
    {
        return $this->belongsToMany('App\Contact')->withPivot('state_id');
    }    
    
    public function products()
    {
        return $this->hasMany('App\Product');
    }
}
