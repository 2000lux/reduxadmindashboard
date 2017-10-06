<?php

namespace App\Http\Controllers\Api\v1;

use App\Task;
use App\Http\Controllers\Controller;
use App\Transformers\TaskTransformer;
use Symfony\Component\HttpFoundation\Request;
use Spatie\Fractal\FractalFacade;

class TaskController extends Controller
{

    private $related = [];

    public function __construct()
    {
        $this->related = [
            'author' => function($query) {
                $query->select('id', 'fullname');
            },
            'receiver' => function($query) {
                $query->select('id', 'fullname');
            },
            'contact' => function($query) {
                $query->select('contacts.id', 'contacts.fullname');
            },
            'enterprise' => function($query) {
                $query->select('enterprises.id', 'legal_name', 'client_type');
            },
            'sector' => function($query) {
                $query->select('id', 'name');
            }
        ];
    }

    private function buildQuery($request, $user_id)
    {

        // get filters
        $status = filter_var($request->input('status'), FILTER_SANITIZE_STRING);
        $date_from = $request->input('date_from');
        $date_to = $request->input('date_to');
        $limit = (int) $request->input('limit') ?: null;

        return Task::with($this->related)
                ->when($date_from, function($query) use ($date_from) {
                    $query->whereDate('created_at', '>=', $date_from);
                })
                ->when($date_to, function($query) use ($date_to) {
                    $query->whereDate('created_at', '<=', $date_to);
                })
                ->when($status, function($query) use ($status) {
                    $query->where('status', $status);
                })
                ->limit($limit)
                ->orderBy('priority', 'desc')
                ->latest('tasks.updated_at');
    }

    private function formatResponse($data, $transformer)
    {
        return fractal()
                ->collection($data)
                ->transformWith($transformer)
                ->toArray();
    }

    /**
     * GET /users/{user_id}/tasks
     *
     * List
     *
     * @return Response
     */
    public function index(Request $request, TaskTransformer $transformer, $user_id)
    {

        try {

            // filter (used only in "created by" results
            $receiver_id = (int) $request->input('receiver_id');

            /**
             * Query assigned to me tasks
             */
            $assigned = $this->buildQuery($request, $user_id)
                ->where('receiver_id', $user_id)
                ->get();

            /**
             * Query created by me tasks
             */
            $created = $this->buildQuery($request, $user_id)
                ->where('author_id', $user_id)
                ->when($receiver_id, function($query) use ($receiver_id) {
                    $query->where('receiver_id', $receiver_id);
                })
                ->get();

            /**
             * transform
             */
            $response['assigned'] = $this->formatResponse($assigned, $transformer);
            $response['created'] = $this->formatResponse($created, $transformer);

        } catch (Exception $exc) {

            return response()->json([ 'message' => 'There was an error retrieving the records' ], 500);
        }

        return [
            'created' => $response['created']['data'],
            'assigned' => $response['assigned']['data']
        ];
    }

    /**
     * GET /tasks/{$id}
     *
     * @param integer $id
     * @return json
     */
    public function show(TaskTransformer $transformer, /*int*/ $task_id)
    {

        try {

            $related = array_merge($this->related, [
                'comments' => function($query) {
                    $query->with(['author'=>function($q) {
                        $q->select('id', 'fullname');
                    }])
                    ->orderBy('created_at', 'DESC');
                }
            ]);

            $data = Task::with($related)
                ->where('id', $task_id)
                ->first();

            // decouple DB columns from API response fields
            $response = FractalFacade::item($data, $transformer)->toArray();

        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Task not found.'], 404);
        }

        return response()->json($response);
    }

     /**
     * POST /tasks
     */
    public function store(Request $request)
    {
        $author_id = auth()->user()->id;

        $this->validate($request, [
                'receiver_id' => 'required|integer',
                'enterprise_id' => 'sometimes|required|integer',
                'sector_id' => 'sometimes|required|integer',
                'contact_id' => 'sometimes|required|integer',
                'priority' => 'required',
                'status' => 'required',
                'description' => 'required',
            ]);

        $task = new Task;
        $task->author_id = (int) $author_id;
        $task->receiver_id = (int) $request->input('receiver_id');
        $task->enterprise_id = (int) $request->input('enterprise_id') ?: null;
        $task->sector_id = (int) $request->input('sector_id') ?: null;
        $task->contact_id = (int) $request->input('contact_id') ?: null;
        $task->priority = filter_var($request->input('priority'), FILTER_SANITIZE_STRING);
        $task->status = filter_var($request->input('status'), FILTER_SANITIZE_STRING);
        $task->description = filter_var($request->input('description'), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $task->save();

        return response()->json([
            'contact_id' => $task->id,
            'created_at' => $task->created_at
        ], 201);
    }

    /**
     * PUT|PATCH /tasks/{$task_id}
     */
    public function update(Request $request, /*int*/ $task_id)
    {
        try {

            if(count($request->all()) === 0) {
                abort(400, 'At least one field must contain data');
            }

            $this->validate($request, [
                'receiver_id' => 'sometimes|required|integer',
                'enterprise_id' => 'sometimes|required|integer',
                'sector_id' => 'sometimes|required|integer',
                'contact_id' => 'sometimes|required|integer',
                'priority' => 'sometimes|required',
                'status' => 'required',
                'description' => 'sometimes|required',
            ]);

            $task = Task::findOrFail(intval($task_id));
            $input = [];
            $input['receiver_id'] = $request->input('receiver_id');
            $input['enterprise_id'] = $request->input('enterprise_id') ?: null;
            $input['sector_id'] = $request->input('sector_id') ?: null;
            $input['contact_id'] = $request->input('contact_id') ?: null;
            $input['priority'] = $request->input('priority');
            $input['status'] = $request->input('status');
            $input['description'] = $request->input('description');

            $request->replace( array_filter($input, function($i){ return !empty($i); } ) ); // remove empty
            $task->fill($request->all()); // fill method assures only expected fields will be stored
            $task->save();


        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found. Update error.'], 404);
        }

        return response()->make('', 204);
    }

    /**
     * PUT|PATCH /tasks/{$task_id}/viewed
     */
    public function viewed(Request $request, /*int*/ $task_id)
    {
        try {

            $task = Task::findOrFail(intval($task_id));
            $task['viewed'] = true;
            $task->save();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found. Update error.'], 404);
        }

        return response()->make('', 204);
    }

    /**
     * DELETE /tasks/{$id}
     *
     * @param int $id
     * @return json
     */
    public function destroy(/*int*/ $id)
    {

        try {

            $model = Task::findOrFail($id);
            $model->delete();
        } catch (ModelNotFoundException $ex) {
            return response()->json(['error' => 'Record not found.'], 404);
        }

        return response()->make('', 204);
    }

}
