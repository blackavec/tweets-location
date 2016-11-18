<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Session\SessionManager;
use Laravel\Socialite\Two\InvalidStateException;
use Illuminate\Auth\AuthManager;
use Laravel\Socialite\Facades\Socialite;

/**
 * @package App\Http\Controllers
 */
class AuthController extends Controller
{
    /**
     * @var Socialite
     */
    protected $socialite;
    /**
     * @var AuthManager
     */
    protected $auth;
    /**
     * @var UserRepository
     */
    protected $userRepo;

    /**
     * @param Socialite      $socialite
     * @param AuthManager    $auth
     * @param UserRepository $userRepo
     */
    public function __construct(
        Socialite $socialite,
        AuthManager $auth,
        UserRepository $userRepo
    )
    {
        $this->socialite = $socialite;
        $this->auth = $auth;
        $this->userRepo = $userRepo;
    }

    /**
     * Handle the redirection from google
     *
     * @return RedirectResponse
     */
    public function twitterAuthRedirectUrl() : RedirectResponse
    {
        if ($this->auth->check()) {
            return redirect()->route('home');
        }

        try {
            $user = $this->socialite::driver('twitter')->user();
        } catch (InvalidStateException $e) {
            return redirect()->route('home');
        }

        if (!$user) {
            return abort(403);
        }

        if (!$this->userRepo->hasUserRegistered($user->getEmail())) {
            $this->userRepo->register($user->getEmail());
        }

        $userId = $this->userRepo->getUserIdByEmail($user->getEmail());

        $this->auth->loginUsingId($userId);

        return redirect()->route('home');
    }
}
