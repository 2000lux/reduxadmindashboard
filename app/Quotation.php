<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{

    protected $fillable = ['number', 'total_price'];

    public function sale()
    {
        return $this->belongsTo('App\Sale');
    }

    public function attachments()
    {
        return $this->hasMany('App\Attachment');
    }

    public function products()
    {
        return $this->belongsToMany('App\Product')
                ->withPivot('quantity', 'currency_id', 'import_expenditure', 'fob_price', 'sale_price');
    }
}
