<?php
namespace App\Transformers;

use App\User;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{

    /**
     * Transforms the User object to a associative array
     * This decouples DB columns from API response structure
     * 
     * @param User $user
     * @return array
     */
    public function transform(User $user)
    {

        $avatar_uri = config('filesystems.disks.public.url') . '/' . config('app.public_resources.avatars');
       
        $date_format = config('app.date_format');
        
        return [
            'id' => (int) $user->id,
            'fullname' => $user->fullname,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->roles[0],
            'image' => $avatar_uri . '/' . $user->image,
            'updated_at' => $user->updated_at->format($date_format),
        ];
    }
}
