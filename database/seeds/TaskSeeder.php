<?php

use App\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Comment;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('comments')->delete();
        DB::table('tasks')->delete();

        $tasks = factory(Task::class, 18)->create();
        $tasks->each(function($task) {
            $comments = factory(Comment::class, rand(1, 4))->create([
                'commentable_id' => $task->id
            ]);
        });
    }
}
