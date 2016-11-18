<?php
namespace App\Repositories;

use App\Models\User;

/**
 * @package App\Repositories
 */
class UserRepository
{
    /**
     * @var User
     */
    protected $user;

    /**
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * check if user has been registered
     *
     * @param string $email
     *
     * @return bool
     */
    public function hasUserRegistered(string $email) : bool
    {
        return $this->user->where('email', $email)->exists();
    }

    /**
     * Return the user id by email
     *
     * @param string $email
     *
     * @return string
     */
    public function getUserIdByEmail(string $email) : string
    {
        return $this->user->where('email', $email)->value('id');
    }

    /**
     * register a new user
     *
     * @param string $email
     *
     * @return null
     */
    public function register(string $email)
    {
        $this->user->create([
            'email' => $email,
        ]);
    }
}
