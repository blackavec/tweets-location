<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Repositories\TwitterRepository;

class ApiController extends Controller
{
    /**
     * @var twitterRepository
     */
    protected $twitterRepos;

    /**
     * @param twitterRepository $twitterRepos
     */
    public function __construct(TwitterRepository $twitterRepos)
    {
        $this->twitterRepos = $twitterRepos;
    }

    /**
     * Perform the search
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function search(Request $request) : JsonResponse
    {
        $this->validate($request, [
            'cityName' => 'required|string',
            'geoLocation' => 'required|array',
            'geoLocation.lat' => 'required|numeric',
            'geoLocation.lng' => 'required|numeric',
        ]);

        return response()->json($this->twitterRepos->search($request->all()), 200);
    }
}
