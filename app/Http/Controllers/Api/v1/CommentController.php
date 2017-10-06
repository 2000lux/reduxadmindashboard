<?php

namespace App\Http\Controllers\Api\v1;

use App\Comment;
use App\Task;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Request;

class CommentController extends Controller
{
    public function store(Request $request, $id = null)
    {
      try {

        $data = $request->all('comment');
        $task = Task::find(intval($id));
        $comment = $task->comments()->create([
          'content' => filter_var($data['comment'], FILTER_SANITIZE_STRING),
          'user_id' => auth()->user()->id,
          'commentable_id' => $id,
          'commentable_type' => Task::class
        ]);

        $author = $comment->author()->first();
        $comment = $comment->toArray();
        $comment['author'] = $author->toArray();

        return response()->json([
          'comment' => $comment
        ]);

      } catch (\Exception $e) {
        return response()->json([ 'message' => 'There was an error saving the record' ], 500);
      }

    }
}
