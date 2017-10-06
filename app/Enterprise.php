<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enterprise extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $fillable = ['legal_name', 'cuit', 'country_id', 'province_id', 'town', 'address', 'zipcode', 'phone', 'observations', 'client_type'];

    protected $hidden = ['deleted_at', 'pivot'];

    public function country()
    {
        return $this->belongsTo('App\Country');
    }
    
    public function province()
    {
        return $this->belongsTo('App\Province');
    }
    
    public function webs()
    {
        return $this->hasMany('App\Web');
    }
    
    public function sectors()
    {
        return $this->hasMany('App\Sector');
    }

    public function contacts()
    {
        return $this->belongsToMany('App\Contact')->withPivot('state_id');
    }

    public function interactions()
    {
        return $this->hasManyThrough('App\Interaction', 'App\Contact');
    }
    
    public function tasks()
    {
        return $this->hasMany('App\Task');
    }
}
