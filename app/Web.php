<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Web extends Model
{
    protected $fillable = ['type', 'link', 'user', 'password', 'enterprise_id'];
    
    protected $hidden = ['enterprise_id', 'created_at', 'updated_at'];
    
    public $timestamps = false;
    
    public function enterprise()
    {
        return $this->belongsTo('App\Enterprise');
    }
}
