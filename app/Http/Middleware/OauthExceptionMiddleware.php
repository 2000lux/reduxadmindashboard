<?php

namespace app\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;

class OauthExceptionMiddleware
{
    public function handle($request, Closure $next)
    {
                    
        $response = $next($request);

        if($response->getStatusCode() == 401) {
            Log::error('Unauthenticated. Old token?');
            throw new AuthenticationException();
        }           

        return $response;       
    }
}
