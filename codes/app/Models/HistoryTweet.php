<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoryTweet extends Model
{
    /**
     * @var string
     */
    protected $table = 'history_tweets';

    /**
     * @var array
     */
    protected $fillable = [
        'history_id',
        'text',
        'profile_avatar',
        'tweet_timestamp',
        'lat',
        'lng',
    ];
}
