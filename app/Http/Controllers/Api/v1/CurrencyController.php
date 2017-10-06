<?php
namespace App\Http\Controllers\Api\v1;

use App\Currency;
use App\Http\Controllers\Controller;

class CurrencyController extends Controller
{

    /**
     * GET /currencies
     * 
     * List
     *
     * @return Response
     */
    public function index()
    {
        try {
            $data = Currency::all();
        } catch (Exception $exc) {
            return response()->json(['message' => 'There was an error retrieving the records'], 500);
        }
        return $data;
    }
}
