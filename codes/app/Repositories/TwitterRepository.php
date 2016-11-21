<?php

namespace App\Repositories;

use Mbarwick83\TwitterApi\TwitterApi;

/**
 * @package App\Repositories
 */
class TwitterRepository
{
    /**
     * @var TwitterApi
     */
    protected $twitterApi;

    /**
     * @param TwitterApi $twitterApi
     */
    public function __construct(TwitterApi $twitterApi)
    {
        $this->twitterApi = $twitterApi;
    }

    /**
     * Search for tweets
     *
     * @param array $query
     *
     * @return array
     */
    public function search(array $query) : array
    {
        return $this->searchTweets($query['cityName'], $query['geoLocation']);
    }

    /**
     * Send request to twitter api in order to fetch tweets
     *  related to specific city name and geo location with relative radius
     *
     * @param string $cityName
     * @param array  $geoLocation
     *
     * @return array
     */
    protected function searchTweets(string $cityName, array $geoLocation) : array
    {
        // Reconfig the timeout to 30 sec
        $this->twitterApi->setTimeouts(30, 30);

        $searchResult = $this->twitterApi->get('search/tweets', [
            'q' => strtolower($cityName),
            'geocode' => $this->createGeoCode($geoLocation),
        ]);

        return $searchResult->statuses;
    }

    /**
     * create Geo code for twitter api search
     *
     * @param array $geoLocation
     *
     * @return string
     */
    protected function createGeoCode(array $geoLocation) : string
    {
        return sprintf(
            '%s,%s,%s',
            $geoLocation['lat'],
            $geoLocation['lng'],
            env('TWITTER_SEARCH_RADIUS', 50) . 'km'
        );
    }
}
