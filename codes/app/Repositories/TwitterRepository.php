<?php

namespace App\Repositories;

use App\Models\History;
use App\Models\HistoryTweet;
use Carbon\Carbon;
use Illuminate\Auth\AuthManager;
use Illuminate\Database\Eloquent\Collection;
use Mbarwick83\TwitterApi\TwitterApi;

/**
 * @package App\Repositories
 */
class TwitterRepository
{
    /**
     * @var AuthManager
     */
    protected $auth;

    /**
     * @var TwitterApi
     */
    protected $twitterApi;

    /**
     * @var History
     */
    protected $history;

    /**
     * @var HistoryTweet
     */
    protected $historyTweet;

    /**
     * @param AuthManager  $auth
     * @param TwitterApi   $twitterApi
     * @param History      $history
     * @param HistoryTweet $historyTweet
     */
    public function __construct(AuthManager $auth, TwitterApi $twitterApi, History $history, HistoryTweet $historyTweet)
    {
        $this->auth         = $auth;
        $this->twitterApi   = $twitterApi;
        $this->history      = $history;
        $this->historyTweet = $historyTweet;
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
        $userId = $this->auth->user()->id;

        $historyTweetsInPastHour = $this->fetchHistoryTweetsOfPastHour(
            $userId,
            $query['caption'],
            $query['cityName']
        );
        
        if ($historyTweetsInPastHour->count() > 0) {
            return $this->transformTweetCacheData($historyTweetsInPastHour);
        }

        $historyId = $this->registerSearchToHistory(
            $userId,
            $query['caption'],
            $query['cityName'],
            $query['geoLocation']
        );

        $tweets = $this->searchTweets($query['cityName'], $query['geoLocation']);

        $this->registerHistoryTweets($historyId, $tweets);

        return $this->transformTweetApiData($tweets);
    }

    /**
     * fetch tweets from history from last hour
     *
     * @param int    $userId
     * @param string $caption
     * @param string $cityName
     *
     * @return Collection
     */
    protected function fetchHistoryTweetsOfPastHour(int $userId, string $caption, string $cityName) : Collection
    {
        $historyId = $this->fetchHistoryId($userId, $caption, $cityName);

        if (!$historyId) {
            return new Collection([]);
        }

        return $this->fetchHistoryTweets($historyId, Carbon::now()->subHour(1), Carbon::now());
    }

    /**
     * fetch the history id base on userId,caption and cityName
     *
     * @param int    $userId
     * @param string $caption
     * @param string $cityName
     *
     * @return int|null
     */
    protected function fetchHistoryId(int $userId, string $caption, string $cityName)
    {
        $history =  $this->history->where('user_id', $userId)
            ->where('caption', $caption)
            ->where('city_name', $cityName)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$history) {
            return;
        }

        return $history->value('id');
    }

    /**
     * fetch history tweets
     *
     * @param int    $historyId
     * @param Carbon $dateRangeStart
     * @param Carbon $dateRangeEnd
     *
     * @return Collection
     */
    protected function fetchHistoryTweets(int $historyId, Carbon $dateRangeStart, Carbon $dateRangeEnd) : Collection
    {
        return $this->historyTweet->where('history_id', $historyId)
            ->whereBetween('created_at', [$dateRangeStart, $dateRangeEnd])
            ->get();
    }

    /**
     * register tweets into history list
     *
     * @param int   $historyId
     * @param array $tweets
     *
     * @return null
     */
    protected function registerHistoryTweets(int $historyId, array $tweets)
    {
        $base = $this;

        $tweetsCollection = new Collection($tweets);

        $tweetsCollection->map(function ($tweet) use ($base, $historyId) {
            if (!$tweet->geo) {
                return;
            }

            $base->historyTweet->create([
                'history_id' => $historyId,
                'text' => $tweet->text,
                'profile_avatar' => $tweet->user->profile_image_url,
                'tweet_timestamp' => $tweet->created_at,
                'lat' => $tweet->geo->coordinates[0],
                'lng' => $tweet->geo->coordinates[1],
            ]);
        });
    }

    /**
     * transform tweets result from api
     *
     * @param Collection $tweetsCollection
     *
     * @return array
     */
    protected function transformTweetCacheData(Collection $tweetsCollection) : array
    {
        $returnCollection = new Collection();

        $tweetsCollection->map(function ($tweet) use ($returnCollection) {
            $returnCollection->push([
                'source' => 'cache',
                'text' => $tweet->text,
                'profile_avatar' => $tweet->profile_avatar,
                'tweet_timestamp' => $tweet->tweet_timestamp,
                'lat' => (float) $tweet->lat,
                'lng' => (float) $tweet->lng,
            ]);
        });

        return $returnCollection->toArray();
    }

    /**
     * transform tweets result from api
     *
     * @param array $tweets
     *
     * @return array
     */
    protected function transformTweetApiData(array $tweets) : array
    {
        $returnCollection = new Collection();

        $tweetsCollection = new Collection($tweets);

        $tweetsCollection->map(function ($tweet) use ($returnCollection) {
            if (!$tweet->geo) {
                return;
            }

            $returnCollection->push([
                'source' => 'api',
                'text' => $tweet->text,
                'profile_avatar' => $tweet->user->profile_image_url,
                'tweet_timestamp' => $tweet->created_at,
                'lat' => (float) $tweet->geo->coordinates[0],
                'lng' => (float) $tweet->geo->coordinates[1],
            ]);
        });

        return $returnCollection->toArray();
    }

    /**
     * register search request into history table
     *
     * @param int    $userId
     * @param string $caption
     * @param string $cityName
     * @param array  $geoLocaiton
     *
     * @return int
     */
    protected function registerSearchToHistory(int $userId, string $caption, string $cityName, array $geoLocation) : int
    {
        $history = $this->history->create([
            'user_id' => $userId,
            'caption' => $caption,
            'city_name' => $cityName,
            'lat' => $geoLocation['lat'],
            'lng' => $geoLocation['lng'],
        ]);

        return $history->id;
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
