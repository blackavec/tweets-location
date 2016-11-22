<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    /**
     * @var string
     */
    protected $table = 'histories';

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'caption',
        'city_name',
        'lat',
        'lng',
    ];
}
