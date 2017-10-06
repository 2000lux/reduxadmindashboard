<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sector extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    
    protected $hidden = ['deleted_at', 'pivot'];
    
    public $timestamps = false;
    
    public function enterprise()
    {
        return $this->belongsTo('App\Enterprise');
    }

    public function contacts()
    {
        return $this->belongsToMany('App\Contact');
    }
    
    public function tasks()
    {
        return $this->hasMany('App\Task');
    }
}
