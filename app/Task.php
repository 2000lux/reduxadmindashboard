<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'author_id', 'receiver_id', 'enterprise_id', 'sector_id', 
        'contact_id', 'priority', 'status', 'viewed', 'description'];
    
    protected $hidden = ['deleted_at'];
    
    public function author()
    {
        return $this->belongsTo('App\User', 'author_id');
    }
    
    public function receiver()
    {
        return $this->belongsTo('App\User', 'receiver_id');
    }
    
    public function contact()
    {
        return $this->belongsTo('App\Contact');
    }
    
    public function enterprise()
    {
        return $this->belongsTo('App\Enterprise');
    }
        
    public function sector()
    {
        return $this->belongsTo('App\Sector');
    }
    
    public function comments() 
    {
        return $this->morphMany('App\Comment', 'commentable');
    }
}
