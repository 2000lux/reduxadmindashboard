<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response as Response2;
use Symfony\Component\HttpKernel\Exception\HttpException;
use function redirect;
use function response;
use function route;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthenticationException::class,
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        TokenMismatchException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  Request  $request
     * @param  \Exception  $exception
     * @return Response
     */
    public function render($request, Exception $e)
    {

        if (!($e instanceof ValidationException)) {

            switch ($e) {           
                case ($e instanceof AuthenticationException): 
                    return response()->json(['error' => 'Unauthenticated.'], 401);
                    break;
                case ($e instanceof AuthorizationException):
                    return response()->json(['error' => 'You are not authorized to execute that action.'], 403);
                    break;
                case ($e instanceof ModelNotFoundException):
                    return response()->json(['error' => 'Sorry, the resource you are looking for could not be found.'], 404);
                    break;
                case ($e instanceof HttpException):
                    Log::error('HttpException in ' . $e->getFile() . ' line: ' . $e->getLine() . ' > ' . $e->getMessage());
                    return response()->json(['error' => Response2::$statusTexts[$e->getStatusCode()]], $e->getStatusCode());
                    break;
                case ($e instanceof FileNotFoundException):
                    return response()->json([ 
                        'message' => 'Requested file does not exist on our server!' ], 500);
                    break;
                default:
                    Log::error($e);
                    return response()->json(['error' => 'Internal server error. Please, contact administrator.'], 500);
            }
        }

        return parent::render($request, $e);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  Request  $request
     * @param  AuthenticationException  $exception
     * @return Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
