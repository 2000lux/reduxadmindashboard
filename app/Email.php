<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    public $timestamps = false;
 
    protected $fillable = ['id', 'email'];
    
    protected $hidden = ['contact_id'];
    
    public function contact()
    {
        return $this->belongsTo('App\Contact');
    }
}
