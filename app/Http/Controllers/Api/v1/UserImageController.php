<?php
namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserImageController extends Controller
{

    /**
     * POST /users/{$user_id}/image
     * 
     * @param Request $request
     * @param int $user_id
     * @return json
     */
    public function store(Request $request, int $user_id)
    {
        $this->authorize('myself', $user_id);

        $user = User::findOrFail($user_id);

        $this->validate($request, [
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,svg|dimensions:min_width=150,min_height=150,max_width=640,max_height=640|max:2048'
        ]);

        try {

            // store image in filesystem
            $storage = Storage::disk('public');
            $images_folder = config('app.public_resources.avatars');
            $new_name = $storage->putFile($images_folder, $request->file('image'), 'public');

            // store in DB
            $user->image = basename($new_name); // just the name, no path
            $user->save();
        } catch (Exception $ex) {
            return response()->json(['error' => 'There was an error saving the image.'], 500);
        }
        return response()->json([
                'name' => basename($new_name),
                'url' => config('filesystems.disks.public.url') . '/' . $new_name
                ], 200);
    }
}
