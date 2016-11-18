<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthManager;
use Laravel\Socialite\Facades\Socialite;

/**
 * @package App\Http\Middleware
 */
class Authentiate
{
    /**
     * @var Socialite
     */
    protected $socialite;
    /**
     * @var AuthManager
     */
    protected $auth;

    public function __construct(
        Socialite $socialite,
        AuthManager $auth
    )
    {
        $this->socialite = $socialite;
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$this->auth->check()) {
            return $this->socialite::driver('twitter')->redirect();
        }

        return $next($request);
    }
}
