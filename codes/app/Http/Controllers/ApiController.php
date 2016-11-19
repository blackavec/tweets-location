<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    /**
     * Perform the search
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function search(Request $request) : JsonResponse
    {
        $this->validate($request , [
            'cityName' => 'required|string',
        ]);



        return response()->json($request->all(), 200);
    }
}
