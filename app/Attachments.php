<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attachments extends Model
{
    
    public function entity()
    {
        return $this->morphTo();
    }
}
