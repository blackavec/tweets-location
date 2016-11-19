<?php

Route::group(['middleware' => 'auth'], function () {
    Route::get('/', [ 'as' => 'home', 'uses' => 'HomeController@home']);
});

Route::get('twitter-auth-redirect-url', [
    'as' => 'twitter-redirect',
    'uses' => 'AuthController@twitterAuthRedirectUrl',
]);
