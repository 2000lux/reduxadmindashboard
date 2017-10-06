<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $hidden = ['deleted_at', 'created_at', 'updated_at', 'pivot'];
    
    public function enterprises()
    {
        return $this->belongsToMany('App\Enterprise')->withPivot('state_id');
    }
    
    public function providers()
    {
        return $this->belongsToMany('App\Provider')->withPivot('state_id');
    }

    public function sectors()
    {
        return $this->belongsToMany('App\Sector');
    }
    
    public function sales()
    {
        return $this->hasMany('App\Sale');
    }
        
    public function interactions()
    {
        return $this->hasMany('App\Interaction');
    }
    
    public function emails()
    {
        return $this->hasMany('App\Email');
    }        
}
