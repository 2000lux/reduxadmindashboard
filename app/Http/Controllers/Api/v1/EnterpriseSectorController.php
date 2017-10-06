<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Sector;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpFoundation\Request;
use function response;

class EnterpriseSectorController extends Controller
{
    /**
     * GET /enterprises/{$id}/sectors
     * 
     * List
     *
     * @return Response
     */
    public function index(Request $request, /*int*/ $enterprise_id)
    {
       
        try {
      
            $data = Sector::whereHas('enterprise', function ($query) use ($enterprise_id) {
                $query->where('id', $enterprise_id);
            })->get();
            
        } catch (Exception $exc) {
           
            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return $data;
    }
    
    /**
     * GET /enterprises/{$enterprise_id}/sectors/{$sector_id}
     * 
     * Retrieves requested sector
     * 
     * @param integer $id 
     * @return json
     */
    public function show(/*int*/ $enterprise_id, $sector_id)
    {

        try {

            $sector = Sector::findOrFail($sector_id);

        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Entity not found.'], 404);
        }

        return response()->json($sector);
    }
    
    /**
     * POST /enterprises/{$enterprise_id}/sectors
     */
    public function store(Request $request, /*int*/ $enterprise_id)
    {       
        try {
            
            $this->validate($request, [
                'name' => 'required|max:50'
            ]);

            $model = new Sector();
            $model->enterprise_id = intval($enterprise_id);
            $model->name = filter_var($request->input('name'), FILTER_SANITIZE_STRING);
            $model->save();

             return response()->json([
                'sector_id' => $model->id,
                'created_at' => $model->created_at
            ], 201);
        } catch (QueryException $ex) {
            return response()->json(['error' => 'Duplicated entry.'], 422);
        }
    }
    
    /**
     * PUT|PATCH /enterprises/{$enterprise_id}/sectors/{$sector_id}
     */
    public function update(Request $request, /*int*/ $enterprise_id, $sector_id)
    {
        try {  
            
            $this->validate($request, [
                'name' => 'required|max:50'
            ]);
            
            $enterprise_id = intval($enterprise_id);

            $model = Sector::where('enterprise_id', $enterprise_id)->findOrFail($sector_id);
            $model->enterprise_id = $enterprise_id;
            $model->name = filter_var($request->input('name'), FILTER_SANITIZE_STRING);
            $model->save();
            
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }
         
        return response()->make('', 204);
    }
    
    /**
     * DELETE /enterprises/{$enterprise_id}/sectors/{$sector_id}
     * 
     * @return json
     */
    public function destroy(/*int*/ $enterprise_id, /*int*/ $sector_id)
    {
      
        try {
            $model = Sector::findOrFail($sector_id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }
}
