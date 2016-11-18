<?php

Route::group(['middleware' => 'auth.twitter'], function () {
    Route::get('/', 'HomeController@home')->name('home');
});

Route::get('twitter-auth-redirect-url', 'AuthController@twitterAuthRedirectUrl');
