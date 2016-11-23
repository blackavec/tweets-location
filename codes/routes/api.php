<?php

Route::get('/search', [ 'as' => 'search', 'uses' => 'ApiController@search']);
Route::get('/history', [ 'as' => 'history', 'uses' => 'ApiController@history']);
